import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import * as moment from 'moment';
import { RDAccount, RDAccountChange } from 'src/app/model/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CU } from 'src/app/shared/comm-util';
import { SnacksComponent } from 'src/app/shared/snacks/snacks.component';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
})
export class NewAccountComponent implements OnInit, OnDestroy {
  accountForm: FormGroup = new FormGroup({});
  onlydigit = /\d+/g;
  existingAccount = true;
  editAccountNo = '';
  editAccountChange = false;
  curAccountObj: RDAccount | RDAccountChange | any = {
    AmountBilled: 0,
    AmountCollected: 0,
    AmountPaid: 0,
    Enabled: true,
    LastBilled: Timestamp.now(),
    LastCollected: Timestamp.now(),
    LastPaid: Timestamp.now(),
    LastUpdateBy: this.auth.curUserRef?.id, //this.auth.curUserRef,
    LastUpdateOn: Timestamp.now(),
    Nominee: '',
    Phoneno: '',
    Whatsapp: false,
  };
  @ViewChild('accountFormGroupDirective')
  accountFormGroupDirective: FormGroupDirective | undefined;
  loaderFlag = false;
  durationInSeconds: number = 3;

  constructor(
    private _formBuilder: FormBuilder,
    public auth: AuthService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnDestroy() {
    // this.accountService.allRD$.unsubscribe();
  }
  ngOnInit(): void {
    // console.log(this.auth.curUserRef?.id);
    this.accountForm = this._formBuilder.group({
      AccountNo: new FormControl('', [Validators.required]),
      AccountName: new FormControl('', [Validators.required]),
      CardNo: new FormControl('', []),
      RdStartDate: new FormControl('', [Validators.required]),
      Installment: new FormControl('', [Validators.required]),
      AmountCollected: new FormControl(0, []),
      AmountPaid: new FormControl(0, []),
      AmountBilled: new FormControl(0, []),
      existingAccount: new FormControl(true),
      Nominee: new FormControl('', []),
      CIFNo: new FormControl('', []),
      Phoneno: new FormControl('', [Validators.pattern('[0-9]{10}')]),
      Whatsapp: new FormControl(false, []),
    });

    this.editAccountNo = this.route.snapshot.paramMap.get('accid') || '';

    this.accountForm.valueChanges.subscribe((formVal) => {
      //return if blank form
      // if (!formVal.AccountName) return;

      if (this.editAccountNo || this.editAccountNo !== '') {
        // console.count(formVal);
        this.editAccountChange =
          formVal.Phoneno !== this.curAccountObj.Phoneno ||
          formVal.Nominee !== this.curAccountObj.Nominee ||
          formVal.AmountCollected !== this.curAccountObj.AmountCollected ||
          formVal.AmountPaid !== this.curAccountObj.AmountPaid ||
          formVal.AmountBilled !== this.curAccountObj.AmountBilled ||
          formVal.Whatsapp !== this.curAccountObj.Whatsapp ||
          formVal.CIFNo !== this.curAccountObj.CIFNo;

        // console.log(
        //   formVal.Phoneno !== this.curAccountObj.Phoneno,
        //   formVal.Nominee !== this.curAccountObj.Nominee,
        //   formVal.AmountCollected !== this.curAccountObj.AmountCollected,
        //   formVal.AmountPaid !== this.curAccountObj.AmountPaid,
        //   formVal.AmountBilled !== this.curAccountObj.AmountBilled,
        //   formVal.Whatsapp !== this.curAccountObj.Whatsapp,
        //   formVal.CIFNo !== this.curAccountObj.CIFNo
        // );
        if (formVal.Nominee) {
          this.accountForm.patchValue(
            {
              Nominee: formVal.Nominee.toUpperCase(),
            },
            { emitEvent: false, onlySelf: true }
          );
        }
      } else {
        console.log(formVal);
        this.accountForm.patchValue(
          {
            AccountName: formVal.AccountName.toUpperCase(),
          },
          { emitEvent: false, onlySelf: true }
        );
      }
    });

    if (this.editAccountNo || this.editAccountNo !== '') {
      this.accountService.allRD$.subscribe({
        next: (x) => {
          if (x.length < 1) return;
          this.curAccountObj = x.filter(
            (obj: RDAccount) => obj.AccountNo === this.editAccountNo
          )[0];

          let editFormData: any = {
            ...this.curAccountObj,
            existingAccount: true,
          };

          editFormData.RdStartDate = (
            this.curAccountObj as RDAccount
          ).RdStartDate.toDate();

          this.accountForm.reset(editFormData);
          console.log('Resetting ');
          this.accountForm.controls['AccountNo'].disable();
          this.accountForm.controls['AccountName'].disable();
          this.accountForm.controls['Installment'].disable();
          this.accountForm.controls['RdStartDate'].disable();
          this.accountForm.controls['CardNo'].disable();
        },
        error: (err) => {
          this.snack(CU.err[0]);
          this.router.navigate(['/home']);
        },
      });
    }
  }
  installmentOrStartDateChange() {
    //if both start date and installemnt is filled
    const { Installment, RdStartDate } = this.accountForm.value;
    if (
      this.accountForm.controls['Installment'] &&
      this.accountForm.controls['RdStartDate']
    ) {
      console.log(RdStartDate);
      // let monthDiff =
      //   moment(moment.now()).diff(RdStartDate as moment.MomentInput, 'months') +
      //   1;
      let monthDiff = CU.monthDiff(RdStartDate.toDate(), new Date()) + 1;
      console.log('month diff', monthDiff);

      let amtTillNow = monthDiff * parseInt(Installment);
      this.accountForm.patchValue(
        {
          AmountCollected: amtTillNow,
          AmountPaid: amtTillNow,
          AmountBilled: amtTillNow,
        },
        { emitEvent: false, onlySelf: true }
      );
    }
  }
  createNewRecord = (p_mode: string) => {
    if (!this.accountForm.valid) return;

    let tempRawData = this.accountForm.getRawValue();

    delete tempRawData.existingAccount;

    let temp_account: RDAccount = tempRawData;
    temp_account.AccountName = temp_account.AccountName.toUpperCase();
    if (temp_account.Nominee)
      temp_account.Nominee = temp_account.Nominee.toUpperCase();
    this.loaderFlag = true;

    //start date translation
    if (this.curAccountObj.RdStartDate) {
      temp_account.RdStartDate = this.curAccountObj.RdStartDate;
    } else {
      temp_account.RdStartDate = Timestamp.fromDate(
        temp_account.RdStartDate.toDate()
      );
    }

    //DEFAULT VALUES
    //IF BILLED ELSE 0
    temp_account.CreatedBy = this.auth.curUserRef?.id; //this.auth.curUserRef;
    temp_account.CreatedOn = Timestamp.now();
    temp_account.LastBilled = Timestamp.fromDate(
      CU.dateFinder(
        temp_account.RdStartDate.toDate(),
        temp_account.Installment,
        temp_account.AmountBilled
      ).calcDate
    );
    temp_account.LastCollected = Timestamp.fromDate(
      CU.dateFinder(
        temp_account.RdStartDate.toDate(),
        temp_account.Installment,
        temp_account.AmountCollected
      ).calcDate
    );
    temp_account.LastPaid = Timestamp.fromDate(
      CU.dateFinder(
        temp_account.RdStartDate.toDate(),
        temp_account.Installment,
        temp_account.AmountPaid
      ).calcDate
    );
    temp_account.Enabled = true;

    try {
      let actionPromise: Promise<void> | Promise<[void, void]>;

      console.log(temp_account);
      actionPromise = this.accountService.createUpdateRDAccount(
        this.auth.curUser ? this.auth.curUser.company : '',
        temp_account
      );

      actionPromise
        .then((obj) => {
          console.log(obj);
          this.snack(
            `खता नंबर ${this.accountForm.getRawValue().AccountNo} का ${
              p_mode === 'C' ? 'नामांकन' : 'सुधार'
            } पूरा हुआ!`
          );

          if (p_mode === 'C') {
            (this.accountFormGroupDirective as FormGroupDirective).resetForm();
            this.accountForm.reset({
              AmountBilled: 0,
              AmountCollected: 0,
              AmountPaid: 0,
              Whatsapp: false,
              existingAccount: true,
            });
          } else {
            this.router.navigate(['/home']);
          }
        })
        .catch((err) => {
          console.log(err);
          this.loaderFlag = false;
          this.snack(CU.err[0]);
        })
        .finally(() => {
          this.loaderFlag = false;
        });
    } catch (e) {
      //display error in popup
      this.loaderFlag = false;
      console.log(e);
      this.snack(CU.err[0]);
    }
  };

  snack(p_msg: string) {
    this._snackBar.openFromComponent(SnacksComponent, {
      data: { message: p_msg },
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snacks',
    });
  }
}
