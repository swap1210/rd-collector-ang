import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$ &&
      this.auth.user$.subscribe((Userdat) => {
        console.log('Userdat', Userdat);
        if (Userdat && Userdat.uid) {
          this.router.navigate(['/home']);
        } else if (Userdat && !Userdat.uid) {
          console.log('Invaid user or no login');
          alert('Invalid user login');
        }
      });
  }
}
