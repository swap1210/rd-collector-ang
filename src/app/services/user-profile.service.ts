import { Injectable, computed, signal } from '@angular/core';
import { Language, User, AccountType } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  //TODO use computed signal of userProfile entity
  curLanguage: Language = Language.HI;
  userProfile = signal<User | undefined>(undefined);
  userIsAccountant = computed(() => {
    return this.userProfile()?.type === AccountType.A;
  });

  constructor() {}

  languageChange() {
    this.curLanguage =
      this.curLanguage === Language.HI ? Language.EN : Language.HI;
  }
}
