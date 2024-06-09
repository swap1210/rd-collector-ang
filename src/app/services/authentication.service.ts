import { Injectable, computed, signal } from '@angular/core';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private anl = !environment.production; //flag for anonymous login
  readonly default_work_group = 'na'; //flag for anonymous login
  private auth = getAuth();
  private user = signal<any>(null);
  isLoggedIn = computed(() => this.user() !== null);
  curUser: User | undefined;
  constructor(private router: Router) {
    onAuthStateChanged(this.auth, (firebaseUser: any) => {
      this.user.set(firebaseUser);
    });
  }

  // Auth logic to run auth providers
  // async AuthLogin(provider: any) {
  // return this.auth
  //   .signInWithPopup(provider)
  //   .then((result) => {
  //     this.updateUserData(result.user);
  //   })
  //   .catch((error) => {
  //     window.alert(error);
  //   });
  // }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    if (environment.production) {
      return signInWithPopup(this.auth, provider)
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Login failed', error);
        });
    } else {
      return signInWithRedirect(this.auth, provider)
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Login failed', error);
        });
    }
  }

  // Sign out
  signOut() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.user();
  }
  // async updateUserData(user: any) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(
  //     `users/${user.uid}`
  //   );

  //   userRef.get().subscribe({
  //     next: (oldData) => {
  //       const data = {};
  //       if (oldData && user.uid === oldData.get('uid')) {
  //         // sessionStorage.setItem('language', oldData.get('language'));
  //         return userRef.set({ last_login: Timestamp.now() }, { merge: true });
  //       } else {
  //         // sessionStorage.clear();
  //         if (this.anl) {
  //           const { uid, displayName, email } = user;
  //           return userRef.set(
  //             {
  //               uid,
  //               displayName,
  //               email,
  //               language: 'hi',
  //               type: AccountType.C,
  //               last_login: Timestamp.now(),
  //               company: this.default_work_group,
  //             },
  //             { merge: true }
  //           );
  //         } else {
  //           this.afAuth.signOut();
  //           alert('Currently new logins are disabled');
  //         }
  //         return { uid: null };
  //       }
  //     },
  //   });
  // }

  // async updateUserDataLanguage(p_language: Language) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(
  //     `users/${this.curUser ? this.curUser.uid : ''}`
  //   );

  //   return userRef.set(
  //     { last_login: Timestamp.now(), language: p_language },
  //     { merge: true }
  //   );
  // }
}
