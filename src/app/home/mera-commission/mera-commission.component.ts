import { Component, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { CommonUtilService } from '../../shared/services/common-util.service';

@Component({
  selector: 'app-mera-commission',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './mera-commission.component.html',
  styleUrl: './mera-commission.component.scss',
})

//TODO need to make this form reactive
export class MeraCommissionComponent {
  commonUtilService = inject(CommonUtilService);
  meraCommissionForm: FormGroup = new FormGroup({
    amt: new FormControl('', [Validators.required]),
  });
  readonly meraCommissionMetadataSignal = computed(() => {
    return this.commonUtilService.metadataSignal().mera_commission;
  });
  constructor() {}

  round(n: number): string {
    return n.toFixed(2);
  }
}
