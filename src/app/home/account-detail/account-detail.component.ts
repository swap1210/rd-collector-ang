import { OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { RDAccount } from '../../model/account.model';
import { AccountService } from '../../services/account.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { CommonUtilService } from '../../shared/services/common-util.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class AccountDetailComponent {
  readonly WHATSAPP_MSG_TEMPLATE: string =
    'नमस्ते $,\n\nआपका *$* महीने का RD का *₹$* लेना बाकी है!\nकृपया *$* तारीख से पहले भुगतान करें!\n\nधन्यवाद ';
  accNo: string | undefined;
  currentAccount = computed(
    () =>
      this.accountService
        .rdAccounts()
        .filter((x) => x.AccountNo === this.accNo)[0]
  );
  public accountSubscribe: Subscription | undefined;

  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private commonUtilService = inject(CommonUtilService);

  constructor() {
    this.accNo = this.route.snapshot.paramMap.get('accid') || '';

    // effect(() => {
    //   if (this.accNo) {
    //     this.currentAccount.set(
    //       this.accountService
    //         .rdAccounts()
    //         .filter((x) => x.AccountNo === this.accNo)[0]
    //     );
    //   }
    // });
  }

  msg() {
    const pendingFromMonth = this.currentAccount()
      ? this.currentAccount()?.LastCollected?.toDate()
      : undefined;
    const d = new Date();
    let lpendingFromMonth = this.currentAccount()
      ? this.currentAccount()?.LastCollected?.toDate()
      : undefined;

    let shouldBeDate = new Date(
      lpendingFromMonth
        ? lpendingFromMonth.setDate(lpendingFromMonth.getDate() - 10)
        : 0
    );

    let CurPendingDate = new Date(d.getFullYear(), d.getMonth() + 1, -10);
    let finalDate =
      shouldBeDate > CurPendingDate ? shouldBeDate : CurPendingDate;

    let str = this.WHATSAPP_MSG_TEMPLATE.replace(
      '$',
      this.currentAccount()?.AccountName.replace('&', 'and') || ''
    )
      .replace(
        '$',
        pendingFromMonth
          ? pendingFromMonth.toLocaleDateString(
              'hi-IN',
              this.commonUtilService.getCalenderOptions().monthOptions
            )
          : ''
      )
      .replace(
        '$',
        (
          (this.currentAccount()?.AmountTillNow || 0) -
          (this.currentAccount()?.AmountCollected || 0)
        ).toString()
      );
    str = str.replace('$', finalDate.toLocaleDateString('hi-IN'));
    return encodeURI(str) + '🙏';
  }
}
