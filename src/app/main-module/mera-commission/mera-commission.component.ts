import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mera-commission',
  templateUrl: './mera-commission.component.html',
  styleUrls: ['./mera-commission.component.scss'],
})
export class MeraCommissionComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  meraCommissionForm: UntypedFormGroup = new UntypedFormGroup({});
  public commission_rate = 0;
  public tds_rate = 0;
  constructor(public auth: AuthService, private _formBuilder: UntypedFormBuilder) {
    auth.commonData$.pipe(takeUntil(this.destroy$)).subscribe((obj) => {
      // console.log(obj);
      // console.log(obj.mera_commission);
      this.commission_rate = obj.mera_commission.commission_rate;
      this.tds_rate = obj.mera_commission.tds_rate;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.meraCommissionForm = this._formBuilder.group({
      amt: new UntypedFormControl('', [Validators.required]),
    });
  }

  round(n: number): string {
    return n.toFixed(2);
  }
}
