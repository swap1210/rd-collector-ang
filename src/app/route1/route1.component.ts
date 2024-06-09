import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-route1',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './route1.component.html',
  styleUrl: './route1.component.scss',
})
export class Route1Component {
  private countSignal = signal(0);

  constructor(private authenticationService: AuthenticationService) {
    effect(() => {
      console.log('countSignal', this.countSignal());
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
