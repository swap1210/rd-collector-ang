import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RDAccount } from '../model/account.model';
import { CU } from '../shared/comm-util';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  allRD$ = new BehaviorSubject<RDAccount[]>([]);
  collectionName = 'rd-records';
  constructor(private firestore: AngularFirestore, auth: AuthService) {
    this.fetchRDAccounts2(auth.curUser ? auth.curUser.company : '');
  }

  fetchRDAccounts2(p_company: string) {
    this.firestore
      .collection<any>(this.collectionName)
      .doc(p_company)
      .valueChanges()
      .pipe(
        map((orgObj: any) => {
          console.log('Internet', orgObj);
          Object.values<RDAccount>(orgObj.all).map((rec: RDAccount) => {
            rec.AmountTillNow =
              (CU.monthDiff(
                (rec.RdStartDate as Timestamp).toDate(),
                new Date()
              ) +
                1) *
              rec.Installment;
          });
          let tempList = Object.values<RDAccount>(orgObj.all);
          return tempList;
        })
      )
      .subscribe({
        next: (val) => {
          this.allRD$.next(val);
        },
      });
  }

  createUpdateRDAccount(p_company: string, p_RDAccount: RDAccount) {
    let acc_key: any = {};
    acc_key[p_RDAccount.AccountNo] = p_RDAccount;
    let temp: any = { all: acc_key };
    console.log();
    return this.firestore
      .collection(this.collectionName)
      .doc(p_company)
      .set(temp, { merge: true });
  }
}
