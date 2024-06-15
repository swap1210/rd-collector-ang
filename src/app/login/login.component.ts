import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
})
export class LoginComponent {
  environment = environment;
  public authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  localUserLoginFormGroup = new FormGroup({
    email: new FormControl('test@g.co', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('password', [Validators.required]),
  });

  constructor() {
    effect(() => {
      console.log('effect');
      if (this.authenticationService.isLoggedIn()) {
        this.router.navigate(['/home']);
      }
    });
  }

  login() {
    if (environment.isLocal) {
      this.authenticationService
        .emailPasswordSignIn({
          email: this.localUserLoginFormGroup.value.email ?? '',
          password: this.localUserLoginFormGroup.value.password ?? '',
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } else {
      this.authenticationService.googleSignIn();
    }
  }
}
