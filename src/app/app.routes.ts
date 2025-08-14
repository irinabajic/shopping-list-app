import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; 

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'lists',
    loadComponent: () => import('./pages/lists/lists.page').then(m => m.ListsPage),
    canActivate: [AuthGuard],
  canMatch: [AuthGuard]
  },
  {
    path: 'list/:id/:name',
    loadComponent: () => import('./pages/list-detail/list-detail.page').then(m => m.ListDetailPage),
    canActivate: [AuthGuard],
  canMatch: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'start',
    loadComponent: () => import('./pages/start/start.page').then( m => m.StartPage)
  },

];