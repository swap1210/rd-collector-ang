import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RDAccount, RDAccountChange } from '../../model/account.model';
import { Timestamp } from 'firebase/firestore';
import { AccountService } from '../../services/account.service';
import { CommonUtil } from '../../shared/util/common-util';
import { UserProfileService } from '../../services/user-profile.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { SnacksComponent } from '../../shared/components/snacks/snacks.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonUtilService } from '../../shared/services/common-util.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
})
export class NewAccountComponent implements OnInit, OnDestroy {
  userProfileService = inject(UserProfileService);
  commonUtilService = inject(CommonUtilService);

  destroy$: Subject<boolean> = new Subject<boolean>();
  public tempRdEndDate!: Date;
  accountForm: FormGroup = new FormGroup({});
  editAccountNo = '';
  editAccountChange = false;
  curAccountObj: RDAccount | RDAccountChange | any = {
    AmountBilled: 0,
    AmountCollected: 0,
    AmountPaid: 0,
    Enabled: true,
    RdEndDate: Timestamp.now(),
    LastBilled: Timestamp.now(),
    LastCollected: Timestamp.now(),
    LastPaid: Timestamp.now(),
    LastUpdateBy: this.userProfileService.userProfile()!.uid,
    LastUpdateOn: Timestamp.now(),
    Nominee: '',
    Phoneno: '',
    Whatsapp: false,
    familyGroup: '',
  };
  // @ViewChild('accountFormGroupDirective')
  // accountFormGroupDirective: FormGroupDirective | undefined;

  loaderFlag = signal<boolean>(false);
  durationInSeconds: number = 3;

  accountService = inject(AccountService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnDestroy() {
    console.log('new account destroy called');
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  ngOnInit(): void {
    // console.log(this.auth.curUserRef?.id);
    this.accountForm = new FormGroup({
      familyGroup: new FormControl('', [Validators.required]),
      AccountNo: new FormControl('', [Validators.required]),
      AccountName: new FormControl('', [Validators.required]),
      CardNo: new FormControl('', []),
      RdStartDate: new FormControl<Date | null>(null, [Validators.required]),
      Period: new FormControl(0, []),
      Installment: new FormControl(0, [Validators.required, Validators.min(1)]),
      AmountCollected: new FormControl(0, []),
      AmountPaid: new FormControl(0, []),
      AmountBilled: new FormControl(0, []),
      Enabled: new FormControl(true),
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
        console.count(formVal);
        this.editAccountChange =
          formVal.Phoneno !== this.curAccountObj.Phoneno ||
          formVal.Nominee !== this.curAccountObj.Nominee ||
          formVal.AmountCollected !== this.curAccountObj.AmountCollected ||
          formVal.AmountPaid !== this.curAccountObj.AmountPaid ||
          formVal.AmountBilled !== this.curAccountObj.AmountBilled ||
          formVal.Whatsapp !== this.curAccountObj.Whatsapp ||
          formVal.CIFNo !== this.curAccountObj.CIFNo ||
          formVal.Enabled !== this.curAccountObj.Enabled ||
          (this.curAccountObj as RDAccount).RdStartDate.toDate().getFullYear() +
            formVal.Period !==
            (this.curAccountObj as RDAccount).RdEndDate?.toDate().getFullYear();
        if (formVal.Nominee) {
          this.accountForm.patchValue(
            {
              Nominee: formVal.Nominee.toUpperCase(),
            },
            { emitEvent: false, onlySelf: true }
          );
        }
      } else {
        if (formVal.AccountName) {
          this.accountForm.patchValue(
            {
              AccountName: formVal.AccountName.toUpperCase(),
            },
            { emitEvent: false, onlySelf: true }
          );
        }
      }
    });

    // if (this.editAccountNo || this.editAccountNo !== '') {
    //   this.accountService
    //     .getAllAccounts()
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: (x) => {
    //         if (x.length < 1) return;

    //         // console.log('Weird val change');
    //         this.curAccountObj = x.filter(
    //           (obj: RDAccount) => obj.AccountNo === this.editAccountNo
    //         )[0];

    //         let editFormData: any = {
    //           ...this.curAccountObj,
    //         };

    //         editFormData.RdStartDate = (
    //           this.curAccountObj as RDAccount
    //         ).RdStartDate.toDate();

    //         //calc period if end date exists
    //         let tEndDate = (this.curAccountObj as RDAccount).RdEndDate;
    //         if (tEndDate) {
    //           editFormData.Period =
    //             tEndDate.toDate().getFullYear() -
    //             (
    //               this.curAccountObj as RDAccount
    //             ).RdStartDate.toDate().getFullYear();

    //           this.tempRdEndDate = tEndDate.toDate();
    //         }

    //         this.accountForm.reset(editFormData);
    //         console.log('Resetting ');
    //         this.accountForm.controls['AccountNo'].disable();
    //         this.accountForm.controls['AccountName'].disable();
    //         this.accountForm.controls['Installment'].disable();
    //         this.accountForm.controls['RdStartDate'].disable();
    //         this.accountForm.controls['CardNo'].disable();
    //       },
    //       error: (err: any) => {
    //         this.snack(CommonUtil.err[0]);
    //         this.router.navigate(['/home']);
    //       },
    //     });
    // }
  }
  installmentOrStartDateChange() {
    const { Installment, RdStartDate } = this.accountForm.value;
    //proceed only if both start date and installment is filled
    if (Installment && RdStartDate) {
      let monthDiff = RdStartDate
        ? CommonUtil.monthDiff(RdStartDate, new Date()) + 1
        : 0;
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

    // TODO some fields like Timestamps won't auto convert
    const temp_account: RDAccount = this.accountForm.value as RDAccount;
    temp_account.AccountName = temp_account.AccountName.toUpperCase();
    if (temp_account.Nominee)
      temp_account.Nominee = temp_account.Nominee.toUpperCase();
    this.loaderFlag.set(true);

    console.log(temp_account.RdStartDate);
    console.log(typeof temp_account.RdStartDate);
    //start date translation
    if (this.curAccountObj.RdStartDate) {
      temp_account.RdStartDate = this.curAccountObj.RdStartDate;
    } else {
      temp_account.RdStartDate = Timestamp.fromDate(
        this.accountForm.value.RdStartDate
      );
      // it was already a timestamp
    }

    //end date translation always
    if (this.tempRdEndDate) {
      temp_account.RdEndDate = Timestamp.fromDate(this.tempRdEndDate);
    }

    //DEFAULT VALUES
    //IF BILLED ELSE 0
    temp_account.CreatedBy = this.userProfileService.rdUserProfileUidComputed();
    temp_account.CreatedOn = Timestamp.now();
    temp_account.LastBilled = Timestamp.fromDate(
      CommonUtil.dateFinder(
        temp_account.RdStartDate.toDate(),
        temp_account.Installment,
        temp_account.AmountBilled
      ).calcDate
    );
    temp_account.LastCollected = Timestamp.fromDate(
      CommonUtil.dateFinder(
        temp_account.RdStartDate.toDate(),
        temp_account.Installment,
        temp_account.AmountCollected
      ).calcDate
    );
    temp_account.LastPaid = Timestamp.fromDate(
      CommonUtil.dateFinder(
        temp_account.RdStartDate.toDate(),
        temp_account.Installment,
        temp_account.AmountPaid
      ).calcDate
    );

    try {
      this.accountService
        .createUpdateRDAccount(
          this.userProfileService.userProfile().company,
          temp_account
        )
        .then((obj) => {
          console.log(obj);
          this.snack(
            `खता नंबर ${this.accountForm.value.AccountNo} का ${
              p_mode === 'C' ? 'नामांकन' : 'सुधार'
            } पूरा हुआ!`
          );

          if (p_mode === 'C') {
            // (this.accountFormGroupDirective as FormGroupDirective).resetForm();
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
          this.loaderFlag.set(false);
          this.snack(CommonUtil.err[0]);
        })
        .finally(() => {
          this.loaderFlag.set(false);
        });
    } catch (e) {
      //display error in popup
      this.loaderFlag.set(false);
      console.log(e);
      this.snack(CommonUtil.err[0]);
    }
  };
  calcEndDate() {
    let sDate = !this.editAccountNo
      ? (this.accountForm.value.RdStartDate as Timestamp).toDate()
      : this.curAccountObj.RdStartDate.toDate();
    sDate.setFullYear(sDate.getFullYear() + this.accountForm.value.Period);
    this.tempRdEndDate = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0);
  }
  snack(p_msg: string) {
    this._snackBar.openFromComponent(SnacksComponent, {
      data: { message: p_msg },
      duration: this.durationInSeconds * 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'snacks',
    });
  }
}
