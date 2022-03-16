import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AccountType, Language } from '../model/user.model';

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
  currentTitle = '';
  showGreeting: boolean = true;
  curLanguage: Language = Language.EN;
  Language = Language;
  Usertype = AccountType;
  curRoute: any;
  translationPending = false;

  constructor(
    public auth: AuthService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    if (this.auth.curUser)
      this.curLanguage = this.auth.curUser.language as Language;
    setTimeout(() => {
      this.showGreeting = false;
    }, 3000);
    this.translateTags();
  }

  translateTags() {
    Object.keys(this.tag).map(
      (val: string) => (this.tag[val] = this.auth.t(this.orgtag[val]))
    );
  }

  ngOnInit(): void {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // console.log(event);
        let tempstr = event
          .toString()
          .replace('NavigationEnd', '')
          .replace('(', '{')
          .replace(')', '}')
          .replace('id', `'id'`)
          .replace('url', `'url'`)
          .replace('urlAfterRedirects', `'urlAfterRedirects'`)
          .split(`'`)
          .join(`"`);
        let { url } = JSON.parse(tempstr);

        this.curRoute = url.split('/');
        this.tagMapping(this.curRoute);
        // let editAccountNo = this._route.snapshot.paramMap.get('accid') || '';
        // console.log(editAccountNo);
      });
  }

  tagMapping(curRoute: string[]) {
    //console.log("Current language ", this.auth.curUser.language);
    if (curRoute.length > 2 && curRoute[1] === 'new-account') {
      this.currentTitle = 'edit-account';
      // console.log(this.tag[this.currentTitle], curRoute[2]);
      this.tag[this.currentTitle] = this.tag[this.currentTitle].replace(
        '$',
        curRoute[2]
      );
    } else if (curRoute.length > 2 && curRoute[1] === 'account-detail') {
      this.currentTitle = 'account-detail';
      // console.log(this.tag[this.currentTitle], curRoute[2]);
      this.tag[this.currentTitle] = this.tag[this.currentTitle].replace(
        '$',
        curRoute[2]
      );
    } else {
      this.currentTitle = curRoute[1];
    }
  }

  languageChange() {
    this.translationPending = true;
    this.curLanguage =
      this.curLanguage === Language.HI ? Language.EN : Language.HI;
    // console.log('translated language', curLang);
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
