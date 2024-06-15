import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { LocalLoginUser } from '../model/local.login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private anl = !environment.production; //flag for anonymous login
  readonly default_work_group = 'na'; //flag for anonymous login
  private auth = getAuth();
  user = signal<any>(null);
  isLoggedIn = computed(() => this.user() !== null);
  constructor() {
    if (environment.isLocal) {
      connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
    }
    onAuthStateChanged(this.auth, (firebaseUser: any) => {
      this.user.set(firebaseUser);
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
