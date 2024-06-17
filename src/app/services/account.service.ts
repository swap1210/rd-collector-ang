import { Injectable, effect, inject } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { RDAccount } from '../model/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  userProfileService = inject(UserProfileService);

  private readonly RD_ACCOUNT_COLLECTION_NAME: string = 'rd-records';

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
    // return this.mergeSetDocument('kk', temp);
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
