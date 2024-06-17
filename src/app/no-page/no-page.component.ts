import { Component, inject } from '@angular/core';
import { CommonUtilService } from '../shared/services/common-util.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-no-page',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './no-page.component.html',
  styleUrl: './no-page.component.scss',
})
export class NoPageComponent {
  commonUtilService = inject(CommonUtilService);
  private router = inject(Router);

  goBack() {
    this.router.navigate(['']);
  }
}
