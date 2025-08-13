import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lists',
    pathMatch: 'full',
  },
  {
    path: 'lists',
    loadComponent: () => import('./pages/lists/lists.page').then(m => m.ListsPage),
  },
  {
    path: 'list/:id/:name',
    loadComponent: () => import('./pages/list-detail/list-detail.page').then(m => m.ListDetailPage),
  },
];