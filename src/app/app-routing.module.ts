import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailComponent } from './main-module/account-detail/account-detail.component';
import { HomeComponent } from './main-module/home/home.component';
import { LoginComponent } from './main-module/login/login.component';
import { NewAccountComponent } from './main-module/new-account/new-account.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-account',
    component: NewAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-account/:accid',
    component: NewAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account-detail/:accid',
    component: AccountDetailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
