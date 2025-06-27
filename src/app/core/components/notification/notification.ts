import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { Notifications } from '../../models/notification.model';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/commonService/common-service';
import { timer, Observable, of } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { materialImports } from '../../models/material.imports';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, materialImports],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notification implements OnInit {
  private notificationService = inject(NotificationService);
  private commonService = inject(CommonService);
  private currentUser = this.commonService.getCurrentUser();

  private notificationsSubject = new BehaviorSubject<Notifications[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$: Observable<number> = of(0);

  ngOnInit(): void {
    if (!this.currentUser?.id) {
      this.notificationsSubject.next([]);
      this.unreadCount$ = of(0);
      return;
    }

    timer(0, 1000 * 30)
      .pipe(
        switchMap(() =>
          this.notificationService.getNotifications(this.currentUser.id)
        )
      )
      .subscribe((notifications) => {
        this.notificationsSubject.next(notifications);
      });

    this.unreadCount$ = this.notifications$.pipe(
      map((notifs) => notifs.filter((n) => !n.read).length)
    );
  }

  public openNotification(n: Notifications): void {
    if (!n.read && n.id) {
      this.notificationService.markAsRead(n.id).subscribe(() => {
        const current = this.notificationsSubject.getValue();
        const updated = current.map((notification) =>
          notification.id === n.id
            ? { ...notification, read: true }
            : notification
        );
        this.notificationsSubject.next(updated); // instantly reflect change in UI
      });
    }
  }
}
