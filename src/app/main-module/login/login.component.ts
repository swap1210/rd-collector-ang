import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public auth: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    console.log('detroy of home');
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.auth.user$ &&
      this.auth.user$.pipe(takeUntil(this.destroy$)).subscribe((Userdat) => {
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
