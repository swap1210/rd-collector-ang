import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RDAccount } from '../model/account.model';
import { CU } from '../shared/comm-util';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // fsObs: Observable<any> | undefined;
  allRD$ = new BehaviorSubject<RDAccount[]>([]);
  collectionName = 'rd-records';
  constructor(private firestore: AngularFirestore, auth: AuthService) {
    // console.log('Acc Serv Cons', auth);
    auth?.user$?.subscribe((Userdat) => {
      // console.log('Userdat', Userdat);
      if (Userdat && Userdat.uid && Userdat.company) {
        this.fetchRDAccounts2(Userdat.company).subscribe(this.allRD$);
      }
    });
  }

  fetchRDAccounts2(p_company: string): Observable<RDAccount[]> {
    return this.firestore
      .collection<any>(this.collectionName)
      .doc(p_company)
      .valueChanges()
      .pipe(
        map((orgObj: any) => {
          // console.log('Internet', orgObj);
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
      .doc(p_company)
      .set(temp, { merge: true });
  }

  createBackupRDAccount(p_company: string) {
    // let acc_key: any = {};
    // let temp: any = { all: acc_key };

    this.allRD$.subscribe({
      next: (temp) => {
        let new_temp: any = {};
        temp.map((rec) => {
          new_temp[rec.AccountNo] = rec;
        });
        console.log(this.collectionName, p_company + '_bkp', { all: new_temp });
        this.firestore
          .collection(this.collectionName)
          .doc(p_company + '_bkp')
          .set({ all: new_temp }, { merge: true });
      },
    });
  }

  ngOnDestroy() {
    console.log('Service on destroy is being called');
  }
}
