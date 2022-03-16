import {
  AfterViewInit,
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
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { Subscription } from 'rxjs';
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
})
export class HomeComponent implements OnDestroy, OnInit {
  public rdlist: RDAccount[] = [];

  public accountSubscribe: Subscription | undefined;

  dataSource: MatTableDataSource<RDAccount> | undefined;
  selection = new SelectionModel<RDAccount>(true, []);

  @ViewChild('curAcc') curAcc: ElementRef<MatSelectionList> | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
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
    private cdRef: ChangeDetectorRef,
    private _bottomSheet: MatBottomSheet
  ) {
    this.filterGroup = formBuilder.group({
      filterInput: '',
      enableAll: false,
    });

    this.filterGroup.valueChanges.subscribe((obj) => {
      console.log('🏡 value changed', obj);
      // obj.filterInput = obj.filterInput.trim().toLowerCase();

      let temp: FilterType = obj;
      console.log(obj);
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
  ngOnInit(): void {
    this.startSubscription();
    this.selection.changed.subscribe((obj) => {
      this.billingTotalFun();
    });
  }
  ngOnDestroy(): void {
    console.log('On destroy called');
    this.accountSubscribe = new Subscription();
  }
  t(p_str: string): string {
    return this.auth.t(p_str);
  }

  fetchPaidMode() {
    if (!this.accountSubscribe) this.startSubscription();
    else {
      const selIndex = this.displayedColumns.indexOf('select');
      if (selIndex > -1) {
        this.selection.clear();
        this.displayedColumns.splice(selIndex, 1);
      }
      this.applyFilter(JSON.stringify(this.filterGroup.getRawValue()));
    }
  }
  fetchBilledMode() {
    if (!this.accountSubscribe) this.startSubscription();
    else {
      if (!this.displayedColumns.includes('select'))
        this.displayedColumns.unshift('select');
      this.applyFilter(JSON.stringify(this.filterGroup.getRawValue()));
    }
  }

  startSubscription(p_mode?: string) {
    this.accountSubscribe = this.accountService.allRD.subscribe(
      (rdDocList) => {
        if (!rdDocList) return;
        let tempAll = rdDocList;
        console.log('Data Refresh', tempAll);
        this.filterGroup.patchValue({ filterInput: '' });
        this.dialog.closeAll();
        this.rdlist = tempAll.all;
        // this.rdlist = Object.values(tempAll.all).map((rec: any) => {
        // rec.AmountTillNow =
        //   (CU.monthDiff(
        //     (rec.RdStartDate as firestore.Timestamp).toDate(),
        //     new Date()
        //   ) +
        //     1) *
        //   rec.Installment;
        // return rec as RDAccount;
        // });
        this.dataFetched = true;
        this.rdlist = Object.values(tempAll.all);
        this.dataSource = new MatTableDataSource(this.rdlist);
        this.dataSource.filterPredicate = this.customFilterPredicate;
        this.cdr.detectChanges();

        this.applyFilter(JSON.stringify(this.filterGroup.getRawValue()));

        // this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
        // if (this.dataSource.paginator) {
        //   this.dataSource.paginator.firstPage();
        // }
      },
      (err) => {
        console.log(err);
        this.dataFetched = true;
        this.rdlist = [];
        // alert('Error loading data');
      },
      () => {
        this.dataFetched = true;
        console.log('Finally after subscription');
      }
    );
  }

  customFilterPredicate = (record: RDAccount, filter: string): boolean => {
    try {
      const unfilter: FilterType = JSON.parse(filter);
      // let tempAmt = 0;
      // if (!this.billingOrCollection) tempAmt = record.AmountCollected;
      // else if (this.billingOrCollection === 'C') tempAmt = record.AmountPaid;
      // else if (this.billingOrCollection === 'B') tempAmt = record.AmountBilled;

      return (
        record.Enabled &&
        (!record.CloseDate || record.CloseDate.toDate() < this.firstDay) &&
        (record.AccountName.includes(
          unfilter.filterInput.trim().toUpperCase()
        ) ||
          record.AccountNo.includes(unfilter.filterInput.trim()) ||
          record.Installment.toString().includes(unfilter.filterInput.trim()) ||
          (unfilter.filterInput.trim().toLowerCase() === 'no phone' &&
            !record.Phoneno) ||
          (unfilter.filterInput.trim().toLowerCase() === 'no cif' &&
            !record.CIFNo)) &&
        ((!this.billingOrCollection &&
          record.AmountCollected <
            (record.AmountTillNow || record.Installment)) ||
          (this.billingOrCollection === 'C' &&
            record.AmountPaid < record.AmountCollected) ||
          (this.billingOrCollection === 'B' &&
            record.AmountBilled < record.AmountPaid &&
            !unfilter.enableAll) ||
          unfilter.enableAll)
      );
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
}
