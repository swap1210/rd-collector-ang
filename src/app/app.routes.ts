import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MeraCommissionComponent as MeraCommissionComponent } from './home/mera-commission/mera-commission.component';
import { NoPageComponent } from './shared/components/no-page/no-page.component';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'new-account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/new-account/new-account.component').then(
        (m) => m.NewAccountComponent
      ),
  },
  {
    path: 'new-account/:accid',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/new-account/new-account.component').then(
        (m) => m.NewAccountComponent
      ),
  },
  {
    path: 'account-detail/:accid',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/account-detail/account-detail.component').then(
        (m) => m.AccountDetailComponent
      ),
  },
  {
    path: 'calculator',
    component: MeraCommissionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', component: NoPageComponent },
];
