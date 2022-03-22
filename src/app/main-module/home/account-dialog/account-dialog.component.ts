import { Component, Inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RDAccount } from 'src/app/model/account.model';
import { AccountType } from 'src/app/model/user.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CU } from 'src/app/shared/comm-util';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
})
export class AccountDialogComponent implements OnInit {
  toBeCollected = false;
  toBePaid = false;
  toBeBilled = false;
  startDate: Date;
  calcCloseDate: Date | undefined;
  actionName = '';
  originalOperatingAmt: number = 0;
  operatingAmt: number = 0;
  operatingAmtRemaining = 0;
  AccountType = AccountType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public rec: RDAccount,
    public auth: AuthService,
    private dialogRef: MatDialogRef<AccountDialogComponent>,
    private accountService: AccountService
  ) {
    this.startDate = (rec.RdStartDate as Timestamp).toDate();

    //use temp variable till end date logic is fixed
    if (!rec.CloseDate) {
      this.calcCloseDate = new Date(this.startDate);
      this.calcCloseDate.setFullYear(this.calcCloseDate.getFullYear() + 5);
    }

    // console.log(rec.Usertype, rec.billingOrCollection, rec.AmountTillNow || 0);
    if (rec.Usertype === AccountType.C) {
      this.toBeCollected = true;

      this.originalOperatingAmt = rec.AmountCollected;
      this.operatingAmtRemaining =
        (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.operatingAmt = this.operatingAmtRemaining;
      this.actionName = 'कलेक्ट';
    } else if (
      rec.Usertype === AccountType.A &&
      rec.billingOrCollection === 'C'
    ) {
      this.toBePaid = true;

      this.originalOperatingAmt = rec.AmountPaid;
      this.operatingAmtRemaining =
        (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.operatingAmt = rec.AmountCollected - rec.AmountPaid;
      this.actionName = 'भुगतान';
    } else if (
      rec.Usertype === AccountType.A &&
      rec.billingOrCollection === 'B'
    ) {
      this.toBeBilled = true;

      this.originalOperatingAmt = rec.AmountBilled;
      this.operatingAmtRemaining =
        (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.operatingAmt = (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.actionName = 'बिल';
    }
  }

  ngOnInit(): void {}

  doAction() {
    let tempPack: any = {
      AccountNo: this.rec.AccountNo,
      LastUpdateOn: Timestamp.now(),
      LastUpdateBy: this.auth.curUserRef?.id,
    };
    // console.log(this.toBeCollected, this.toBePaid, this.toBeBilled);
    if (this.toBeCollected) {
      tempPack.AmountCollected = this.rec.AmountCollected + this.operatingAmt;
      tempPack.LastCollected = CU.dateFinder(
        (this.rec.RdStartDate as Timestamp).toDate(),
        this.rec.Installment,
        tempPack.AmountCollected
      ).calcDate;
      // console.log(tempPack);
    } else if (this.toBePaid) {
      tempPack.AmountPaid = this.rec.AmountPaid + this.operatingAmt;
      tempPack.LastPaid = CU.dateFinder(
        (this.rec.RdStartDate as Timestamp).toDate(),
        this.rec.Installment,
        tempPack.AmountPaid
      ).calcDate;

      console.log(tempPack.AmountPaid, this.rec.AmountCollected);
      //if Paid is different then Collected update collected accordingly
      if (tempPack.AmountPaid !== this.rec.AmountCollected) {
        tempPack.AmountCollected = tempPack.AmountPaid;
        tempPack.LastCollected = CU.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
      }
    } else if (this.toBeBilled) {
      tempPack.AmountBilled = this.rec.AmountBilled + this.operatingAmt;
      tempPack.LastBilled = CU.dateFinder(
        (this.rec.RdStartDate as Timestamp).toDate(),
        this.rec.Installment,
        tempPack.AmountBilled
      ).calcDate;

      //if Billed is different then Paid update Paid accordingly
      if (tempPack.AmountBilled !== this.rec.AmountPaid) {
        tempPack.AmountPaid = tempPack.AmountBilled;
        tempPack.LastPaid = CU.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountPaid
        ).calcDate;
      }

      //if Billed is different then Collected update collected accordingly
      if (tempPack.AmountBilled !== this.rec.AmountCollected) {
        tempPack.AmountCollected = tempPack.AmountBilled;
        tempPack.LastCollected = CU.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
      }
    }
    this.accountService
      .createUpdateRDAccount(
        this.auth.curUser ? this.auth.curUser.company : '',
        tempPack
      )
      .then(() => {
        this.dialogRef.close({
          diaCloseMsg: 'Collection complete for ' + this.rec.AccountNo,
        });
      })
      .catch((err) => {
        this.dialogRef.close({
          diaCloseMsg: 'Some error occured ' + this.rec.AccountNo,
        });
      });
  }
  closeAction = () => {
    let tempPack: any = {
      AccountNo: this.rec.AccountNo,
      LastUpdateOn: Timestamp.now(),
      LastUpdateBy: this.auth.curUserRef?.id,
    };

    if (
      this.rec.Usertype === AccountType.A &&
      (this.rec.AmountPaid !== this.rec.AmountCollected ||
        //billing condition 1 & 2
        this.rec.AmountPaid !== this.rec.AmountBilled ||
        this.rec.AmountCollected !== this.rec.AmountBilled ||
        false)
    ) {
      if (this.rec.billingOrCollection === 'C') {
        //revert Collected to Paid amount
        tempPack.AmountCollected = this.rec.AmountPaid;
        tempPack.LastCollected = CU.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
      }
      if (this.rec.billingOrCollection === 'B') {
        //revert Collected to Billed amount
        tempPack.AmountCollected = this.rec.AmountBilled;
        tempPack.LastCollected = CU.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
        //revert Paid to Billed amount
        tempPack.AmountPaid = this.rec.AmountBilled;
        tempPack.LastPaid = CU.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountPaid
        ).calcDate;
      }

      this.accountService
        .createUpdateRDAccount(
          this.auth.curUser ? this.auth.curUser.company : '',
          tempPack
        )
        .then(() => {
          this.dialogRef.close({
            diaCloseMsg: 'Collection complete for ' + this.rec.AccountNo,
          });
        })
        .catch((err) => {
          this.dialogRef.close({
            diaCloseMsg: 'Some error occured ' + this.rec.AccountNo,
          });
        });
    } else {
      this.dialogRef.close({
        diaCloseMsg: 'Collection cancelled for ' + this.rec.AccountNo,
      });
    }
  };
}
