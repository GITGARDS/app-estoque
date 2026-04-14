import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard') },
  { path: 'products', loadComponent: () => import('./pages/products/products') },
  { path: 'movements', loadComponent: () => import('./pages/movements/movements') },
];
