import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  Language,
  AccountType,
  RDUserProfileModel,
} from '../model/rd.user.profile.model.model';
import { AuthenticationService } from './authentication.service';
import { doc, onSnapshot } from 'firebase/firestore';
import { FIRESTORE } from '../app.config';

interface UserProfileState {
  rDUserProfileModel: RDUserProfileModel;
  error: string | null;
}
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private firestore = inject(FIRESTORE);
  authenticationService = inject(AuthenticationService);
  private readonly USER_PROFILE_COLLECTION_NAME: string = 'users';

  userProfile = signal<RDUserProfileModel>({
    company: '',
    email: '',
    language: Language.HI,
    type: AccountType.C,
    uid: '',
  });

  userIsAccountant = computed(() => {
    return this.userProfile()?.type === AccountType.A;
  });

  // state
  state = signal<UserProfileState>({
    rDUserProfileModel: {
      company: '',
      email: '',
      language: Language.HI,
      type: AccountType.C,
      uid: '',
    },
    error: null,
  });

  rdUserProfileUidComputed = computed(
    () => this.authenticationService.user()?.uid
  );

  constructor() {
    effect(() => {
      if (this.rdUserProfileUidComputed()) {
        const unsub = onSnapshot(
          doc(
            this.firestore,
            this.USER_PROFILE_COLLECTION_NAME,
            this.rdUserProfileUidComputed()!
          ),
          (doc) => {
            console.log('Current data: ', doc.data());
            this.state.update((state) => ({
              ...state,
              commModel: doc.data() as RDUserProfileModel,
            }));
          }
        );
      }
      console.count('onSnapshot called');
    });
  }

  languageChange() {
    throw new Error('Method not implemented.');
  }
}
