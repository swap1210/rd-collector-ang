import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { RDAccount } from '../model/account.model';
import { FIRESTORE } from '../app.config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly RD_ACCOUNT_COLLECTION_NAME: string = 'rd-records';
  userProfileService = inject(UserProfileService);
  private firestore = inject(FIRESTORE);

  // TODO make state private
  private state = signal<{ all: any }>({ all: {} });
  rdAccounts = computed<RDAccount[]>(() => Object.values(this.state().all));
  rdAccountMap = computed<RDAccount[]>(() => Object.values(this.state().all));
  familyGroupAutoCompleteSuggestion = computed<Set<string>>(() => {
    return new Set(
      this.rdAccounts()
        .filter((rd) => rd?.familyGroup)
        .map((rd) => rd.familyGroup)
    );
  });

  constructor() {
    effect(() => {
      if (this.userProfileService.userProfile().company) {
        // this.documentId = this.userProfileService.userProfile()!.company;
        onSnapshot(
          doc(
            this.firestore,
            this.RD_ACCOUNT_COLLECTION_NAME,
            this.userProfileService.userProfile()!.company
          ),
          (doc) => {
            console.log('Account data: ', doc.data());
            this.state.update((state) => ({
              ...state,
              ...doc.data(),
            }));
          }
        );
      }
    });
  }

  createUpdateRDAccount(p_company: string, p_RDAccount: RDAccount) {
    let acc_key: any = {};
    acc_key[p_RDAccount.AccountNo] = p_RDAccount;
    let temp: any = { all: acc_key };
    return setDoc(
      doc(this.firestore, this.RD_ACCOUNT_COLLECTION_NAME, p_company),
      temp,
      { merge: true }
    );
  }

  createUpdateOneRDAccount(p_RDAccount: RDAccount) {
    return this.createUpdateRDAccount(
      this.userProfileService.userProfile()!.company,
      p_RDAccount
    );
  }

  takeBackup = () => {
    if (!this.userProfileService.userProfile()) {
      return;
    }
    return setDoc(
      doc(
        this.firestore,
        this.RD_ACCOUNT_COLLECTION_NAME,
        this.userProfileService.userProfile().company + '-backup'
      ),
      this.state(),
      { merge: true }
    );
  };
}
