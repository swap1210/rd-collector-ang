import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { AuthService } from 'src/app/services/auth.service';
import { CU } from 'src/app/shared/comm-util';

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
  displayedColumns = ['accNo', 'cardNo', 'installment', 'amount'];
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SelectedMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public sm: { list: SelectMenu[]; total: number },
    private auth: AuthService
  ) {
    console.log(sm);
  }

  closePopup(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  t(p_str: string): string {
    return this.auth.t(p_str);
  }
}
