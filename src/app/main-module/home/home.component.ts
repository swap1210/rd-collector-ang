import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatSelectionList } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RDAccount } from 'src/app/model/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CU } from 'src/app/shared/comm-util';
import { AccountType } from 'src/app/model/user.model';
import { SnacksComponent } from 'src/app/shared/snacks/snacks.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  SelectedMenuComponent,
  SelectMenu,
} from './selected-menu/selected-menu.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

interface FilterType {
  filterInput: string;
  enableAll: boolean;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  public rdlist: RDAccount[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  // public accountSubscribe: Subscription | undefined;

  dataSource: MatTableDataSource<RDAccount> | undefined;
  selection = new SelectionModel<RDAccount>(true, []);

  @ViewChild('curAcc') curAcc: ElementRef<MatSelectionList> | undefined;
  @ViewChild(MatPaginator, { static: false }) paginator:
    | MatPaginator
    | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;

  displayedColumns: string[] = ['AccountNo', 'AccountName', 'Installment'];
  durationInSeconds: number = 3;

  AccountType = AccountType;
  firstDay: Date;
  lastDay: Date;
  LastMonthFirstDay: Date;
  LastMonthLastDay: Date;
  billingOrCollection: string = 'C';
  dataFetched = false;

  filterGroup: FormGroup;
  billingList: string[] = [];
  billingTotal: number = 0;
  sm_arr: SelectMenu[] = [];

  constructor(
    public accountService: AccountService,
    public auth: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    formBuilder: FormBuilder,
    private _bottomSheet: MatBottomSheet
  ) {
    this.filterGroup = formBuilder.group({
      filterInput: '',
      enableAll: false,
    });

    this.filterGroup.valueChanges.subscribe((obj) => {
      // obj.filterInput = obj.filterInput.trim().toLowerCase();

      let temp: FilterType = obj;
      // console.log(obj);
      this.applyFilter(JSON.stringify(temp));
    });

    let date = new Date();
    this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.LastMonthFirstDay = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    );
    this.LastMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0);
  }

  ngOnDestroy(): void {
    console.log('detroy of home');
    // this.accountService.allRD$?.unsubscribe();

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.startSubscription();
    this.selection.changed.subscribe((obj) => {
      this.billingTotalFun();
    });
  }
  t(p_str: string): string {
    return this.auth.t(p_str);
  }

  fetchPaidMode() {
    // if (!this.accountSubscribe) this.startSubscription();
    // else {
    const selIndex = this.displayedColumns.indexOf('select');
    if (selIndex > -1) {
      this.selection.clear();
      this.displayedColumns.splice(selIndex, 1);
    }
    this.applyFilter(JSON.stringify(this.filterGroup.getRawValue()));
    // }
  }

  fetchBilledMode() {
    // if (!this.accountSubscribe) this.startSubscription();
    // else {
    if (!this.displayedColumns.includes('select'))
      this.displayedColumns.unshift('select');
    this.applyFilter(JSON.stringify(this.filterGroup.getRawValue()));
    // }
  }

  startSubscription(p_mode?: string) {
    // console.count('trying here but' + JSON.stringify(this.accountSubscribe));
    // this.accountSubscribe =
    this.accountService
      .getAllAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rdDocList) => {
          console.log('Home sub', rdDocList.length);
          // console.log('Atleast heres');
          if (!rdDocList.length) return;
          console.count('data loaded');
          let tempAll = rdDocList;
          this.filterGroup.patchValue({ filterInput: '', enableAll: false });
          this.dialog.closeAll();
          this.dataFetched = true;
          this.rdlist = tempAll;
          this.dataSource = new MatTableDataSource(this.rdlist);
          this.dataSource.filterPredicate = this.customFilterPredicate;
          this.cdr.detectChanges();

          this.applyFilter(JSON.stringify(this.filterGroup.getRawValue()));
        },
        error: (err) => {
          console.log(err);
          this.dataFetched = true;
          this.rdlist = [];
          // alert('Error loading data');
        },
        complete: () => {
          this.dataFetched = true;
          console.log('Finally after subscription');
        },
      });
  }

  customFilterPredicate = (record: RDAccount, filter: string): boolean => {
    try {
      const unfilter: FilterType = JSON.parse(filter);

      //ignore all further filters if enableAll is toggled
      if (unfilter.enableAll) {
        const selIndex = this.displayedColumns.indexOf('select');
        if (selIndex > -1) {
          this.selection.clear();
          this.displayedColumns.splice(selIndex, 1);
        }
        return (
          record.AccountName.includes(
            unfilter.filterInput.trim().toUpperCase()
          ) ||
          record.AccountNo.includes(unfilter.filterInput.trim().toUpperCase())
        );
      } else {
        // billingOrCollection
        // console.log(this.filterGroup.getRawValue());
        if (
          this.billingOrCollection == 'B' &&
          !this.displayedColumns.includes('select')
        )
          this.displayedColumns.unshift('select');
      }

      //record is Enabled
      let recordFinalFilter = record.Enabled;
      // console.debug(recordFinalFilter);

      //record is active
      recordFinalFilter &&=
        !record.RdEndDate || record.RdEndDate.toDate() >= this.firstDay;
      // console.log(
      //   !record.RdEndDate || record.RdEndDate.toDate() > this.firstDay,
      //   !record.RdEndDate || record.RdEndDate.toDate(),
      //   this.firstDay
      // );

      //start of search string
      //record name include search string unfilter.filterInput
      recordFinalFilter &&=
        record.AccountName.includes(
          unfilter.filterInput.trim().toUpperCase()
        ) ||
        //record account number include search string unfilter.filterInput
        record.AccountNo.includes(unfilter.filterInput.trim()) ||
        record.Installment.toString().includes(unfilter.filterInput.trim()) ||
        //search for records with no phone number if "no phone" is passed in search string
        (unfilter.filterInput.trim().toLowerCase() === 'no phone' &&
          !record.Phoneno) ||
        //search for records with no cif number if "no cif" is passed in search string
        (unfilter.filterInput.trim().toLowerCase() === 'no cif' &&
          !record.CIFNo) ||
        //search for records with no end date if "no end" is passed in search string
        (unfilter.filterInput.trim().toLowerCase() === 'no end' &&
          !record.RdEndDate) ||
        //search for records which are maturing
        (unfilter.filterInput.trim().toLowerCase() === 'mature' &&
          record.maturity == 0);
      //end of search string
      console.debug(recordFinalFilter + ' .' + unfilter.filterInput + '.');

      //show if collected/paid amount is less than AmountTillNow or Installment (for first case)
      recordFinalFilter &&=
        (!this.billingOrCollection &&
          record.AmountCollected <
            (record.AmountTillNow || record.Installment)) ||
        (this.billingOrCollection === 'AC' &&
          record.AmountCollected >=
            (record.AmountTillNow || record.Installment) &&
          record.AmountCollected > record.AmountPaid) ||
        (this.billingOrCollection === 'C' &&
          record.AmountPaid < (record.AmountTillNow || record.Installment)) ||
        (this.billingOrCollection === 'B' &&
          record.AmountBilled < (record.AmountTillNow || record.Installment));
      //console.debug(recordFinalFilter + ' ' + (this.billingOrCollection === 'C'));

      return recordFinalFilter;
    } catch (e) {
      console.log('Filter failure', e);
      return true;
    }
  };

  applyFilter(filterString: string) {
    if (this.dataSource) {
      this.dataSource.filter = filterString;

      if (this.sort) this.dataSource.sort = this.sort;
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  snack(p_msg: string) {
    console.log(this.selection.selected);
    this._snackBar.openFromComponent(SnacksComponent, {
      data: { message: p_msg },
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
  rowClick(p_row_data: any) {
    if (this.auth.curUser && this.auth.curUser.type === AccountType.A) {
      // console.log('Accountent clicked');
      this.openDialog(p_row_data, AccountType.A);
    } else {
      console.log('Collector clicked', p_row_data);
      this.openDialog(p_row_data, AccountType.C);
    }
  }

  openDialog(p_recordData: RDAccount, p_usertype: AccountType) {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: 'auto',
      data: {
        ...p_recordData,
        Usertype: p_usertype,
        billingOrCollection: this.billingOrCollection,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result:`, result);
      if (result && result.msg) this.snack(result.msg);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (!this.dataSource) {
      console.log('Data not ready');
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    if (this.dataSource) this.selection.select(...this.dataSource.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(p_row?: RDAccount): string {
    if (!p_row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    } else {
      return `${this.selection.isSelected(p_row) ? 'deselect' : 'select'} row ${
        this.selection.selected.length
      }`;
    }
  }

  billingTotalFun() {
    console.log('billingTotalFun called');
    if (this.selection.selected.length === 0) this.billingTotal = 0;
    this.billingTotal = 0;
    let tempBillingList: string[] = [];
    this.sm_arr = [];
    this.selection.selected.forEach((rec) => {
      const tempCal = rec.AmountPaid - rec.AmountBilled;
      tempBillingList.push(rec.AccountNo);
      this.sm_arr.push({
        accNo: rec.AccountNo,
        name: rec.AccountName,
        amount: tempCal,
        cardNo: rec.CardNo,
        installment: rec.Installment,
      });
      this.billingTotal += tempCal;
    });

    this.billingList = tempBillingList;
  }

  openSelectedMenu() {
    this._bottomSheet.open(SelectedMenuComponent, {
      data: { list: this.sm_arr, total: this.billingTotal },
    });
  }

  myTracker(index: number, rd_record: RDAccount): string {
    return `${rd_record.AccountNo}`;
  }

  ngAfterViewInit(): void {
    this.auth.user$?.pipe(takeUntil(this.destroy$)).subscribe((obj) => {
      if (this.paginator) {
        // console.log('user change');
        this.paginator._intl.itemsPerPageLabel = CU.t(
          obj?.language,
          'एक बार में कितने खाते देखने हैं: '
        );
        // console.log('user change', obj, this.paginator._intl);
      }
      // trigger rdlist Subscription
      // this.accountService.fetchRDAccounts2(obj.company);
    });
  }
}
