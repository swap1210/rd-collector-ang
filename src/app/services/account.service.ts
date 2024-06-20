import { Injectable, effect, inject, signal } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { RDAccount } from '../model/account.model';
import { FIRESTORE } from '../app.config';
import { doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly RD_ACCOUNT_COLLECTION_NAME: string = 'rd-records';
  userProfileService = inject(UserProfileService);
  private firestore = inject(FIRESTORE);
  familyGroupAutoCompleteSuggestion = signal<string[]>([
    'Ram Parivar',
    'Sharma Parivar',
  ]);

  getAllAccounts() {}

  constructor() {
    effect(() => {
      if (this.userProfileService.userProfile()) {
        // this.documentId = this.userProfileService.userProfile()!.company;
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

  takeBackup = (rdDocument: any) => {
    if (!this.userProfileService.userProfile()) {
      return;
    }
    // return this.setNewDocument(
    //   this.userProfileService.userProfile()!.company + '-backup',
    //   rdDocument
    // );
  };
}
