import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatCardModule as MatCardModule } from '@angular/material/card';
import { MatMenuModule as MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule as MatListModule } from '@angular/material/list';
import { MatTableModule as MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule as MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar';
import { SnacksComponent } from './snacks/snacks.component';
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const moduleList = [
  CommonModule,
  ReactiveFormsModule,
  NoopAnimationsModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatMenuModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatSlideToggleModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  ClipboardModule,
  MatBottomSheetModule,
];

@NgModule({
  declarations: [SnacksComponent],
  imports: moduleList,
  exports: moduleList,
})
export class SharedModule {}
