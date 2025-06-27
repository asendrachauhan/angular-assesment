import {
  CanActivate,
  CanLoad,
  CanActivateChild,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  private checkAccess(expectedRoles: string[] | string): boolean {
    const currentRole = this.authService.getUserRole()?.toLowerCase();
if(currentRole) {
    if (Array.isArray(expectedRoles)) {
      return expectedRoles.includes(currentRole);
    } else {
      return currentRole === expectedRoles;
    }
  }
  return false
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.checkAccess(route.data['role'])) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (!this.checkAccess(route.data?.['role'])) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
