import { Component, OnInit, inject } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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
export class MeraCommissionComponent implements OnInit {
  commonUtilService = inject(CommonUtilService);
  meraCommissionForm: FormGroup = new FormGroup({
    amt: new FormControl('', [Validators.required]),
  });
  commission_rate = toSignal(
    this.commonUtilService
      .getComm()
      .pipe(map((data) => data?.mera_commission?.commission_rate)),
    {
      initialValue: 0,
    }
  );
  readonly tds_rate = 4;
  constructor(
    public auth: AuthenticationService,
    private _formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {}

  round(n: number): string {
    return n.toFixed(2);
  }
}
