import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonUtilService } from '../../services/common-util.service';

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
