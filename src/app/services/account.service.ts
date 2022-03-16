import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RDAccount } from '../model/account.model';
import { CU } from '../shared/comm-util';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  allRD = new BehaviorSubject<any>(undefined);
  collectionName = 'rd-records';
  constructor(private firestore: AngularFirestore, auth: AuthService) {
    console.log('here');
    this.fetchRDAccounts(auth.curUser ? auth.curUser.company : '').subscribe(
      (obj) => {
        // console.log('Internet data fetch', obj);
        this.allRD.next(obj);
      }
    );
  }

  fetchRDAccounts(p_company: string): Observable<any> {
    return this.firestore
      .collection<any>(this.collectionName)
      .doc(p_company)
      .valueChanges()
      .pipe(
        filter((orgObj: any) => {
          let newObj = orgObj;

          Object.values<RDAccount>(newObj.all).map((rec: RDAccount) => {
            newObj.all[rec.AccountNo].AmountTillNow =
              (CU.monthDiff(
                (rec.RdStartDate as Timestamp).toDate(),
                new Date()
              ) +
                1) *
              rec.Installment;

            return false;
          });

          return newObj;
        })
      );
  }
  createUpdateRDAccount(p_company: string, p_RDAccount: RDAccount) {
    let accountNo = p_RDAccount.AccountNo;
    let temp: any = {};
    temp[accountNo] = p_RDAccount;
    return this.firestore
      .collection(this.collectionName)
      .doc(p_company)
      .set({ all: temp }, { merge: true });
  }
}
