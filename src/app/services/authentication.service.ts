import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  Auth,
  GoogleAuthProvider,
  User,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { LocalLoginUser } from '../model/local.login.model';
import { AUTH } from '../app.config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // private anl = !environment.production; //flag for anonymous login
  // readonly default_work_group = 'na'; //flag for anonymous login
  // private auth = getAuth();
  private auth = inject(AUTH);

  user = computed(() => {
    return this.state().user;
  });
  isLoggedIn = computed(
    () => this.user() !== null && this.user() !== undefined
  );

  // private newUser$ = onAuthStateChanged(this.auth, (firebaseUser: any) => {});

  private user$ = this.authState(this.auth);

  private state = signal<AuthState>({ user: undefined });

  constructor() {
    if (environment.isLocal) {
      connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
    }
    // onAuthStateChanged(this.auth, (firebaseUser: any) => {
    //   this.user.set(firebaseUser);
    // });

    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      this.state.update((state) => ({ ...state, user }));
    });
  }

  googleSignIn = () => {
    //TODO handle failed login case
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  };

  emailPasswordSignIn = (localLoginUser: LocalLoginUser) => {
    if (environment.isLocal) {
      return signInWithEmailAndPassword(
        this.auth,
        localLoginUser.email,
        localLoginUser.password
      );
    } else {
      return new Promise((resolve, reject) => {
        reject('Invalid event call');
      });
    }
  };

  // Sign out
  signOut() {
    return signOut(this.auth);
  }

  authState(auth: Auth): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        observer.next(user);
      });

      return () => unsubscribe();
    });
  }
}
