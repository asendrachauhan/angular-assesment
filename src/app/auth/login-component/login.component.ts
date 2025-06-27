import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../authService/auth-service';
import { CommonService } from '../../core/services/commonService/common-service';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { materialImports } from '../../core/models/material.imports';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, materialImports],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private ngZone = inject(NgZone);

  public loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  public errorMsg$ = new BehaviorSubject<string | null>(null);

  public onSubmit(): void {
    const { username, password } = this.loginForm.value;

    this.authService
      .login(username as string, password as string)
      .pipe(
        tap((response) => {
          if (response.status === 200) {
            this.commonService.openSuccessSnackBar(response.msg);
            this.router.navigate(['/dashboard']);
          } else {
            this.ngZone.run(() => this.errorMsg$.next(response.msg));
            this.commonService.openFailureSnackBar(response.msg);
          }
        }),
        catchError((err) => {
          this.commonService.openFailureSnackBar(err.msg || 'Login failed');
          this.errorMsg$.next('Something went wrong');
          return of();
        })
      )
      .subscribe();
  }
}
