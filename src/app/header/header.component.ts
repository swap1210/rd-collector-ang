import { Component, inject, effect, signal, computed } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileService } from '../services/user-profile.service';
import { AuthenticationService } from '../services/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { HeaderAction } from '../model/header.action.model';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { AccountType, Language } from '../model/rd.user.profile.model.model';
import { AccountService } from '../services/account.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly env = environment;
  readonly Language = Language;

  authenticationService = inject(AuthenticationService);
  accountService = inject(AccountService);
  userProfileService = inject(UserProfileService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  //TODO should this be a signal? as it might update in runtime
  headerActions = computed<HeaderAction[]>(() => [
    {
      label: '🏡',
      styleClass: 'menuItems',
      action: (param: any) => this.goRoute(param),
      param: '/home',
      mobileLabel: '🏡 होम स्क्रीन',
      mobileStyleClass: 'phoneBtn',
    },
    {
      label: '🧮',
      styleClass: 'menuItems',
      action: (param: any) => this.goRoute(param),
      param: '/calculator',
      // innerIcon: {
      //   fontIcon: 'calculate',
      // },
      mobileLabel: '🧮 मेरा कमीशन',
      mobileStyleClass: 'phoneBtn',
    },
    {
      label: '🇮🇳',
      styleClass: 'menuItems',
      action: () => this.languageChange(),
      mobileLabel: '🇮🇳 भाषा बदले (English)',
      mobileStyleClass: 'phoneBtn',
    },
    {
      label: '➕',
      styleClass: 'menuItems',
      action: (param: any) => this.goRoute(param),
      param: '/new-account',
      accountType: AccountType.A,
      mobileLabel: '➕ नया खाता',
      mobileStyleClass: 'phoneBtn',
    },
    {
      label: '☁️',
      styleClass: 'menuItems',
      action: (param: any) => this.accountService.takeBackup(param),
      param: this.accountService.state(),
      accountType: AccountType.A,
      // innerIcon: {
      //   fontIcon: 'backup',
      // },
      mobileLabel: '☁️ हमशकल खाते',
      mobileStyleClass: 'phoneBtn',
    },
    {
      label: '🔌',
      styleClass: 'menuItems',
      action: () => this.signOut(),
      // innerIcon: {
      //   fontIcon: 'power_settings_new',
      // },
      mobileLabel: '🔌 बंद करे',
      mobileStyleClass: 'phoneBtn',
    },
  ]);

  showGreeting = signal(true);
  currentTitle = signal<HeaderAction | undefined>(undefined);

  constructor() {
    console.log('authenticationService.isLoggedIn');
    effect(() => {
      if (!this.authenticationService.isLoggedIn()) {
        console.log('not logged in redirecting to login');
        this.router.navigate(['/login']);
      }
      setTimeout(() => {
        this.showGreeting.set(false);
      }, 3000);
    });
  }
  signOut() {
    this.authenticationService.signOut();
  }

  // setCurrentTitle(titleName: string) {
  //   const title = this.headerActions.find(
  //     (headerActions) => headerActions.label === titleName
  //   );
  //   this.currentTitle.set(title);
  // }

  languageChange = (): void => {
    this.userProfileService.languageChange();
  };

  goRoute(path: string) {
    this.router.navigate([path]);
  }

  toggleTheme() {
    this.themeService.darkMode.set(!this.themeService.darkMode());
  }

  notLoggedIn() {
    window.alert('Please login to continue');
  }
}
