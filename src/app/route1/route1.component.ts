import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-route1',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './route1.component.html',
  styleUrl: './route1.component.scss',
})
export class Route1Component {
  private countSignal = signal(0);

  public authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authenticationService.user()) {
        this.router.navigate(['/login']);
      }
    });
  }

  logOut() {
    this.authenticationService.signOut();
  }
  //create increment method

  increment() {
    this.countSignal.update((c) => c + 1);
  }

  decrement() {
    this.countSignal.update((c) => c - 1);
  }

  //create reset method
  reset() {
    this.countSignal.set(0);
  }

  get count() {
    return this.countSignal;
  }
}
