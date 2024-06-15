import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public authenticationService = inject(AuthenticationService);
}
