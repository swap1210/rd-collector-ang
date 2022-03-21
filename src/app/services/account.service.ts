import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RDAccount } from '../model/account.model';
import { CU } from '../shared/comm-util';
import { AuthService } from './auth.service';
import { obj } from '../services/temp';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  fsObs: Observable<any> | undefined;
  allRD$ = new BehaviorSubject<RDAccount[]>([]);
  collectionName = 'rd-records';
  constructor(private firestore: AngularFirestore, auth: AuthService) {
    // console.log('Acc Serv Cons');
    this.fsObs = this.fetchRDAccounts2(
      auth.curUser ? auth.curUser.company : ''
    );
    this.fsObs.subscribe(this.allRD$);
  }

  fetchRDAccounts2(p_company: string): Observable<RDAccount[]> {
    return this.firestore
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
      );
  }

  createUpdateRDAccount(p_company: string, p_RDAccount: RDAccount) {
    let acc_key: any = {};
    acc_key[p_RDAccount.AccountNo] = p_RDAccount;
    let temp: any = { all: acc_key };
    return this.firestore
      .collection(this.collectionName)
      .doc(p_company + '_bkp')
      .set(temp, { merge: true });
  }

  ngOnDestroy() {
    console.log('Service on destroy is being called');
  }
}
