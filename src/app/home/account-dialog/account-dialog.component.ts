import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { AccountType } from '../../model/rd.user.profile.model.model';
import { RDAccount } from '../../model/account.model';
import { AuthenticationService } from '../../services/authentication.service';
import { AccountService } from '../../services/account.service';
import { Timestamp } from 'firebase/firestore';
import { CommonUtil } from '../../shared/util/common-util';
import { UserProfileService } from '../../services/user-profile.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AccountDialogComponent {
  toBeCollected = false;
  toBePaid = false;
  toBeBilled = false;
  actionName = '';
  originalOperatingAmt: number = 0;
  operatingAmtRemaining = 0;
  AccountType = AccountType;

  public userProfileService = inject(UserProfileService);
  private accountService = inject(AccountService);
  updateOneAccountFormGroup = new FormGroup({
    operatingAmt: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public rec: RDAccount,
    private dialogRef: MatDialogRef<AccountDialogComponent>
  ) {
    // console.log(rec.Usertype, rec.billingOrCollection, rec.AmountTillNow || 0);
    if (rec.Usertype === AccountType.C) {
      this.toBeCollected = true;

      this.originalOperatingAmt = rec.AmountCollected;
      this.operatingAmtRemaining =
        (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.updateOneAccountFormGroup.patchValue({
        operatingAmt: this.operatingAmtRemaining,
      });
      this.actionName = 'कलेक्ट';
    } else if (
      rec.Usertype === AccountType.A &&
      (rec.billingOrCollection === 'C' || rec.billingOrCollection === 'AC')
    ) {
      this.toBePaid = true;

      this.originalOperatingAmt = rec.AmountPaid;
      this.operatingAmtRemaining =
        (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.updateOneAccountFormGroup.patchValue({
        operatingAmt: rec.AmountCollected - rec.AmountPaid,
      });
      this.actionName = 'भुगतान';
    } else if (
      rec.Usertype === AccountType.A &&
      rec.billingOrCollection === 'B'
    ) {
      this.toBeBilled = true;

      this.originalOperatingAmt = rec.AmountBilled;
      this.operatingAmtRemaining =
        (rec.AmountTillNow || 0) - this.originalOperatingAmt;
      this.updateOneAccountFormGroup.patchValue({
        operatingAmt: (rec.AmountTillNow || 0) - this.originalOperatingAmt,
      });
      this.actionName = 'बिल';
    }
  }

  doAction() {
    let tempPack: any = {
      AccountNo: this.rec.AccountNo,
      LastUpdateOn: Timestamp.now(),
      LastUpdateBy: this.userProfileService.userProfile()?.uid,
    };
    // console.log(this.toBeCollected, this.toBePaid, this.toBeBilled);
    if (this.toBeCollected) {
      tempPack.AmountCollected =
        this.rec.AmountCollected +
        (this.updateOneAccountFormGroup.value.operatingAmt || 0);
      tempPack.LastCollected = CommonUtil.dateFinder(
        (this.rec.RdStartDate as Timestamp).toDate(),
        this.rec.Installment,
        tempPack.AmountCollected
      ).calcDate;
    } else if (this.toBePaid) {
      tempPack.AmountPaid =
        this.rec.AmountPaid +
        (this.updateOneAccountFormGroup.value.operatingAmt || 0);
      tempPack.LastPaid = CommonUtil.dateFinder(
        (this.rec.RdStartDate as Timestamp).toDate(),
        this.rec.Installment,
        tempPack.AmountPaid
      ).calcDate;

      console.log(tempPack.AmountPaid, this.rec.AmountCollected);
      //if Paid is different then Collected update collected accordingly
      if (tempPack.AmountPaid !== this.rec.AmountCollected) {
        tempPack.AmountCollected = tempPack.AmountPaid;
        tempPack.LastCollected = CommonUtil.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
      }
    } else if (this.toBeBilled) {
      tempPack.AmountBilled =
        this.rec.AmountBilled +
        (this.updateOneAccountFormGroup.value.operatingAmt || 0);
      tempPack.LastBilled = CommonUtil.dateFinder(
        (this.rec.RdStartDate as Timestamp).toDate(),
        this.rec.Installment,
        tempPack.AmountBilled
      ).calcDate;

      //if Billed is different then Paid update Paid accordingly
      if (tempPack.AmountBilled !== this.rec.AmountPaid) {
        tempPack.AmountPaid = tempPack.AmountBilled;
        tempPack.LastPaid = CommonUtil.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountPaid
        ).calcDate;
      }

      //if Billed is different then Collected update collected accordingly
      if (tempPack.AmountBilled !== this.rec.AmountCollected) {
        tempPack.AmountCollected = tempPack.AmountBilled;
        tempPack.LastCollected = CommonUtil.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
      }
    }
    this.accountService
      .createUpdateOneRDAccount(tempPack)
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

  updateOperatingAmt(increase: boolean) {
    const currentOperatingAmt =
      this.updateOneAccountFormGroup.value.operatingAmt || 0;
    if (increase) {
      this.updateOneAccountFormGroup.patchValue({
        operatingAmt: currentOperatingAmt + this.rec.Installment,
      });
    } else {
      this.updateOneAccountFormGroup.patchValue({
        operatingAmt: currentOperatingAmt - this.rec.Installment,
      });
    }
  }

  resetOperatingAmt() {
    this.updateOneAccountFormGroup.patchValue({
      operatingAmt: (this.rec.AmountTillNow || 0) - this.originalOperatingAmt,
    });
  }

  closeAction = () => {
    let tempPack: any = {
      AccountNo: this.rec.AccountNo,
      LastUpdateOn: Timestamp.now(),
      LastUpdateBy: this.userProfileService.userProfile()?.uid,
    };

    // console.log(this.rec);
    if (
      this.rec.Usertype === AccountType.A &&
      (this.rec.AmountPaid !== this.rec.AmountCollected ||
        this.rec.AmountPaid !== this.rec.AmountBilled) &&
      (((this.rec.billingOrCollection === 'C' ||
        this.rec.billingOrCollection === 'AC') &&
        this.rec.AmountPaid) ||
        (this.rec.billingOrCollection === 'B' && this.rec.AmountBilled))
    ) {
      if (
        this.rec.billingOrCollection === 'AC' ||
        this.rec.billingOrCollection === 'C'
      ) {
        //revert Collected to Paid amount
        tempPack.AmountCollected = this.rec.AmountPaid;
        tempPack.LastCollected = CommonUtil.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
      }
      if (this.rec.billingOrCollection === 'B') {
        //revert Collected to Billed amount
        tempPack.AmountCollected = this.rec.AmountBilled;
        tempPack.LastCollected = CommonUtil.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountCollected
        ).calcDate;
        //revert Paid to Billed amount
        tempPack.AmountPaid = this.rec.AmountBilled;
        tempPack.LastPaid = CommonUtil.dateFinder(
          (this.rec.RdStartDate as Timestamp).toDate(),
          this.rec.Installment,
          tempPack.AmountPaid
        ).calcDate;
      }
      let self = this;
      console.log('patching', tempPack);
      this.accountService
        .createUpdateOneRDAccount(tempPack)
        .then(() => {
          self.dialogRef.close({
            diaCloseMsg: 'Collection complete for ' + this.rec.AccountNo,
          });
        })
        .catch((err) => {
          console.log(2);
          self.dialogRef.close({
            diaCloseMsg: 'Some error occurred ' + this.rec.AccountNo,
          });
        });
    } else {
      this.dialogRef.close({
        diaCloseMsg: 'Collection cancelled for ' + this.rec.AccountNo,
      });
    }
  };
}
