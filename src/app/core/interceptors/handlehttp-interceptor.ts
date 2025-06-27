import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { error } from 'console';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/authService/auth-service';

export const handlehttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const AuthToken = authService.getToken();

  if (AuthToken) {
    const authreq = req.clone({
      setHeaders: {
        Authorization: `BEARER ${AuthToken}`,
      },
    });
    return next(authreq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
