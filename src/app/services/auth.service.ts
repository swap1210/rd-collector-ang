import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { AccountType, Language, User } from '../model/user.model';
import { CU } from '../shared/comm-util';
import { environment } from 'src/environments/environment';
import { GoogleAuthProvider } from '@angular/fire/auth';
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
  commonData$: BehaviorSubject<any> = new BehaviorSubject({});
  curUser: User | undefined;
  curUserRef: DocumentReference<User> | undefined;
  // public curUserRef: DocumentReference<User> | undefined;
  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private afs: AngularFirestore, // Inject Firestore service
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          //yes logged in but loggin only if there is a existing profile of him in the user document
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

    //get common data
    this.afs
      .collection<any>('comm')
      .doc(CU.imgDoc)
      .valueChanges()
      .subscribe({
        next: (vv) => {
          Object.keys(vv.img).map((ev) => {
            let prep_str = CU.iu_p1 + ev + CU.iu_p2 + vv.img[ev];
            console.log(prep_str);
            vv.img[ev] = prep_str;
            return [];
          });
          this.commonData$.next(vv.img);
        },
      });
  }

  // Auth logic to run auth providers
  async AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.updateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  googleSignin() {
    return this.AuthLogin(new GoogleAuthProvider());
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

    userRef.get().subscribe({
      next: (oldData) => {
        const data = {};
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
            this.afAuth.signOut();
          }
          return { uid: null };
        }
      },
    });
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
