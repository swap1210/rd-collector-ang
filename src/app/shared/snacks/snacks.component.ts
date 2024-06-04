import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBarRef as MatSnackBarRef,
  MAT_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snacks',
  templateUrl: './snacks.component.html',
  styleUrls: ['./snacks.component.scss'],
})
export class SnacksComponent implements OnInit {
  message: string;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackbarRef: MatSnackBarRef<SnacksComponent>
  ) {
    this.message = data.message;
    console.log(this.message);
  }

  ngOnInit(): void {}
}
