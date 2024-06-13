import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './mera-commission.component.html',
  styleUrl: './mera-commission.component.scss',
})

//TODO need to make this form reactive
export class MeraCommissionComponent implements OnInit {
  commonService = inject(CommonUtilService);
  meraCommissionForm: FormGroup = new FormGroup({});
  readonly commission_rate =
    this.commonService.getCommissionMetaData().commission_rate;
  readonly tds_rate = this.commonService.getCommissionMetaData().tds_rate;
  constructor(
    public auth: AuthenticationService,
    private _formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.meraCommissionForm = this._formBuilder.group({
      amt: new FormControl('', [Validators.required]),
    });
  }

  round(n: number): string {
    return n.toFixed(2);
  }
}
