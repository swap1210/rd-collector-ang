import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CU } from 'src/app/shared/comm-util';

@Component({
  selector: 'app-nopage',
  templateUrl: './nopage.component.html',
  styleUrls: ['./nopage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NopageComponent implements OnInit {
  msg: string = '';
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$?.subscribe({
      next: (usr) => {
        this.msg = CU.t(
          usr.language,
          '404 यह एक अमान्य रास्ता है। कृपया ऊपर दिए 🏡 चिह्न में जाए।'
        );
      },
    });
  }
}
