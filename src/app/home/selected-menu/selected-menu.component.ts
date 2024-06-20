import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { AuthenticationService } from '../../services/authentication.service';

export interface SelectMenu {
  accNo: string;
  name: string;
  amount: number;
  cardNo: string;
  installment: number;
}

@Component({
  selector: 'app-selected-menu',
  templateUrl: './selected-menu.component.html',
  styleUrls: ['./selected-menu.component.scss'],
})
export class SelectedMenuComponent {
  // displayedColumns = ['accNo', 'cardNo', 'installment', 'amount'];
  // constructor(
  //   private _bottomSheetRef: MatBottomSheetRef<SelectedMenuComponent>,
  //   @Inject(MAT_BOTTOM_SHEET_DATA)
  //   public sm: { list: SelectMenu[]; total: number },
  //   private authenticationService: AuthenticationService
  // ) {
  //   console.log(sm);
  // }
  // closePopup(event: MouseEvent): void {
  //   this._bottomSheetRef.dismiss();
  //   event.preventDefault();
  // }
}
