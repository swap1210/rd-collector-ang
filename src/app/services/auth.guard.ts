import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('this.auth.user$ ');
    return this.auth.user$
      ? this.auth.user$.pipe(
          take(2),
          map((user) => !!user),
          tap((loggedIn) => {
            if (!loggedIn) {
              console.log('access denied');
              this.router.navigate(['/login']);
            }
          })
        )
      : EMPTY;
  }
}
