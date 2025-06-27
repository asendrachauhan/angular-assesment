import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notifications } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

 public getNotifications(userId: string) {
    return this.http.get<Notifications[]>(`${this.baseUrl}?userId=${userId}&_sort=-createdAt`);
  }

 public markAsRead(id: string) {
    return this.http.patch(`${this.baseUrl}/${id}`, { read: true });
  }

 public create(notification: Notifications) {
    return this.http.post<Notification>(this.baseUrl, notification);
  }
}
