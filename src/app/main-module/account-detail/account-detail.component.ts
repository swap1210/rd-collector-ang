import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RDAccount } from 'src/app/model/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CU } from 'src/app/shared/comm-util';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailComponent implements OnInit {
  accNo: string | undefined;
  ca!: RDAccount;
  public accountSubscribe: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.accNo = this.route.snapshot.paramMap.get('accid') || '';
    this.accountSubscribe = this.accountService.allRD$.subscribe((obj) => {
      //return when no data
      console.log('detail sub');
      if (!obj.length) return;

      if (obj && this.accNo) {
        this.ca = obj.filter(
          (cur_rec) => cur_rec.AccountNo === this.accNo
        )[0] as RDAccount;
      }
    });
  }

  msg() {
    const pendingFromMonth = this.ca
      ? this.ca.LastCollected.toDate()
      : undefined;
    const d = new Date();
    let lpendingFromMonth = this.ca
      ? this.ca.LastCollected.toDate()
      : undefined;

    let shouldBeDate = new Date(
      lpendingFromMonth
        ? lpendingFromMonth.setDate(lpendingFromMonth.getDate() - 10)
        : 0
    );

    let CurPendingDate = new Date(d.getFullYear(), d.getMonth() + 1, -10);
    let finalDate =
      shouldBeDate > CurPendingDate ? shouldBeDate : CurPendingDate;

    let str = CU.msg[0] as string;
    str = str.replace(
      '$',
      this.ca ? this.ca.AccountName.replace('&', 'and') : ''
    );
    str = str.replace(
      '$',
      pendingFromMonth
        ? pendingFromMonth.toLocaleDateString('hi-IN', CU.monthOptions)
        : ''
    );
    str = str.replace(
      '$',
      (
        ((this.ca ? this.ca.AmountTillNow : 0) || 0) -
        (this.ca ? this.ca.AmountCollected : 0)
      ).toString()
    );
    str = str.replace(
      '$',
      finalDate.toLocaleDateString('hi-IN', CU.dateOptions)
    );
    return encodeURI(str) + '🙏';
  }
}
