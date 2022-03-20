import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AccountType, Language, User } from '../model/user.model';
import { CU } from '../shared/comm-util';
import { environment } from 'src/environments/environment';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  anl = !environment.production; //flag for anonymous login
  user$: Observable<any> | undefined;
  curUser: User | undefined;
  curUserRef: DocumentReference<User> | undefined;
  // public curUserRef: DocumentReference<User> | undefined;
  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private afs: AngularFirestore, // Inject Firestore service
    private router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.curUserRef = this.afs.doc<User>(`users/${user.uid}`).ref;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.user$.subscribe((obj) => {
      this.curUser = obj;
    });
  }

  // async googleSignin() {
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(this.afAuth, provider)
  //     .then((credential) => {
  //       this.updateUserData(credential.user);
  //     })
  //     .catch((err) => {
  //       this.updateUserData(undefined);
  //     });
  // }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.updateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  googleSignin() {
    return this.AuthLogin(new GoogleAuthProvider()).then((res: any) => {
      if (res) {
        this.router.navigate(['home']);
      }
    });
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  async updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    // if(this.curUser)
    let oldData = await userRef.get().toPromise();
    oldData && console.log('oldData', oldData.data());
    const data = {
      // uid,
      // company: 'ss',
      // displayName,
      // email,
      // language: oldData.get('language'),
      // type: oldData.get('type'),
    };
    console.log(data);
    if (oldData && user.uid === oldData.get('uid')) {
      sessionStorage.setItem('language', oldData.get('language'));
      return userRef.set({ last_login: Timestamp.now() }, { merge: true });
    } else {
      sessionStorage.clear();
      if (this.anl) {
        const { uid, displayName, email } = user;
        return userRef.set(
          {
            uid,
            displayName,
            email,
            language: 'hi',
            type: AccountType.C,
            last_login: Timestamp.now(),
            company: 'ss',
          },
          { merge: true }
        );
      } else {
        await this.afAuth.signOut();
      }
      return { uid: null };
    }
  }

  async updateUserDataLanguage(p_language: Language) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${this.curUser ? this.curUser.uid : ''}`
    );

    return userRef.set(
      { last_login: Timestamp.now(), language: p_language },
      { merge: true }
    );
  }

  t(p_str: string): string {
    return this.curUser ? CU.t(this.curUser.language, p_str) : '';
  }
}
