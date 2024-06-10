import { Component, inject, effect } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileService } from '../services/user-profile.service';
import { AuthenticationService } from '../services/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userProfileService = inject(UserProfileService);
  public authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authenticationService.user()) {
        this.router.navigate(['/login']);
      }
    });
  }
  signOut() {
    this.authenticationService.signOut();
  }
}
