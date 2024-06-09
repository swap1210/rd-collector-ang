import { Routes } from '@angular/router';
import { Route1Component } from './route1/route1.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: Route1Component,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
