import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NoPageComponent } from './no-page/no-page.component';
import { NewAccountComponent } from './home/new-account/new-account.component';
import { MeraCommissionComponent as MeraCommissionComponent } from './home/mera-commission/mera-commission.component';
import { AccountDetailComponent } from './home/account-detail/account-detail.component';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'new-account',
    component: NewAccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'new-account/:accid',
    component: NewAccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'account-detail/:accid',
    component: AccountDetailComponent,
    canActivate: [authGuard],
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
