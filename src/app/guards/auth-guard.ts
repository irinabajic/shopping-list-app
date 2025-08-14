import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanMatch,
  Router,
  UrlTree,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanMatch {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const ok = this.auth.isLoggedIn();
    if (ok) return true;
    return this.router.createUrlTree(['/start'], {
      queryParams: { loginRequired: 1, returnUrl: state.url }
    });
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const ok = this.auth.isLoggedIn();
    if (ok) return true;
    const url = '/' + segments.map(s => s.path).join('/');
    return this.router.createUrlTree(['/start'], {
      queryParams: { loginRequired: 1, returnUrl: url }
    });
  }
}
