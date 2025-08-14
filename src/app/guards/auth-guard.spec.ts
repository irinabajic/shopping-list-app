import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AuthService } from '../services/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow when logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    const result = guard.canActivate({} as ActivatedRouteSnapshot, { url: '/lists' } as RouterStateSnapshot);
    expect(result).toBeTrue();
  });

  it('should redirect when not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    router.createUrlTree.and.returnValue({} as UrlTree);

    const result = guard.canActivate({} as ActivatedRouteSnapshot, { url: '/lists' } as RouterStateSnapshot);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/start'], {
      queryParams: { loginRequired: 1, returnUrl: '/lists' }
    });
    expect(result as UrlTree).toBeTruthy();
  });
});
