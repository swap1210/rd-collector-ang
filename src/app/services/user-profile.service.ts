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

  //TODO use computed signal of userProfile entity
  curLanguage: Language = Language.HI;
  // userProfile: Signal<RDUserProfileModel> = toSignal(
  //   this.FetchObservableData<RDUserProfileModel>(
  //     'ASuyTn5zsvY7oVdWLkhQXuwxAy9V'
  //   ),
  //   {
  //     initialValue: {
  //       company: '',
  //       email: '',
  //       language: Language.HI,
  //       type: AccountType.C,
  //       uid: '',
  //     },
  //   }
  // );
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

  userUid = computed(() => this.authenticationService.user()?.uid);

  constructor() {
    effect(() => {
      const documentId = this.authenticationService.user()?.uid;
      if (documentId) {
        const unsub = onSnapshot(
          doc(this.firestore, this.USER_PROFILE_COLLECTION_NAME, documentId),
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
    this.curLanguage =
      this.curLanguage === Language.HI ? Language.EN : Language.HI;
  }
}
