import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AccountType, Language } from '../model/user.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  orgtag: any = {
    '': '🏡',
    home: '🏡',
    'new-account': 'नया खाता',
    'edit-account': 'खाता नंबर $ में बदलाव',
    'account-detail': '$ का विवरण',
  } as const;
  tag: any = {
    '': '',
    home: '',
    'new-account': '',
    'edit-account': '',
    'account-detail': '',
  };
  currentTitle = 'home';
  showGreeting: boolean = true;
  curLanguage: Language = Language.EN;
  Language = Language;
  Usertype = AccountType;
  curRoute: string[] = [];
  translationPending = false;

  constructor(
    public auth: AuthService,
    private _router: Router,
    public accSer: AccountService
  ) {
    if (this.auth.curUser)
      this.curLanguage = this.auth.curUser.language as Language;
    setTimeout(() => {
      this.showGreeting = false;
    }, 3000);
    this.translateTags();

    //not working correctly
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.curRoute = (event as any)['url'].split('/');
        this.tagMapping();
      });
  }

  translateTags() {
    Object.keys(this.tag).map((val: string) => {
      this.tag[val] = this.auth.t(this.orgtag[val]);
      // console.log('HDR tag key ', val, this.tag[val]);
    });
  }

  ngOnInit(): void {}

  tagMapping() {
    if (this.curRoute.length > 2 && this.curRoute[1] === 'new-account') {
      this.currentTitle = 'edit-account';
    } else if (
      this.curRoute.length > 2 &&
      this.curRoute[1] === 'account-detail'
    ) {
      this.currentTitle = 'account-detail';
    } else {
      this.currentTitle = this.curRoute[1];
    }
  }

  languageChange() {
    this.translationPending = true;
    this.curLanguage =
      this.curLanguage === Language.HI ? Language.EN : Language.HI;
    this.auth
      .updateUserDataLanguage(this.curLanguage)
      .then(() => {
        this.translateTags();
      })
      .finally(() => {
        this.translationPending = false;
      });
  }
}
