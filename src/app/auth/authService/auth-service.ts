// auth.service.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { Users } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public apiUrl = 'http://localhost:3000/users';
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {}

  public login(
  email: string,
  password: string
): Observable<{ msg: string; status: number }> {
  return this.http.get<Users[]>(`${this.apiUrl}?userName=${email}&password=${password}`).pipe(
    map((result) => {
      if (result[0]) {
        const fakeToken = 'dummy-jwt-token';
        const user = {
          id: result[0].id,
          role: result[0].role,
        };

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify(user));
        }

        return { msg: 'Login Successfully', status: 200 };
      } else {
        return { msg: 'Invalid Credentials', status: 401 };
      }
    }),
    catchError(() => of({ msg: 'Something went wrong', status: 500 }))
  );
}


  public logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  public getUserRole(): string | null {
      if (isPlatformBrowser(this.platformId)) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role || null;
    }
    return null
  }

  public isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  public getToken() {
      if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return '';
  }
}
