import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { NewAccountComponent } from './new-account/new-account.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { AccountDialogComponent } from './home/account-dialog/account-dialog.component';
import { FormsModule } from '@angular/forms';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { SelectedMenuComponent } from './home/selected-menu/selected-menu.component';
import { NopageComponent } from './nopage/nopage.component';
import { MeraCommissionComponent } from './mera-commission/mera-commission.component';

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    NewAccountComponent,
    LoaderComponent,
    AccountDialogComponent,
    AccountDetailComponent,
    SelectedMenuComponent,
    NopageComponent,
    MeraCommissionComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule, RouterModule],
})
export class MainModule {}
