import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
})
export class LoginComponent {
  public authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authenticationService.user()) {
        this.router.navigate(['/home']);
      }
    });
  }

  login() {
    this.authenticationService.googleSignIn();
  }
}
