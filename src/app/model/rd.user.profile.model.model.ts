export enum AccountType {
  A = 'a',
  C = 'c',
}

export enum Language {
  HI = 'hi',
  EN = 'en',
}

export interface RDUserProfileModel {
  company: string;
  displayName?: string;
  email: string;
  language: Language;
  type: AccountType;
  uid: string;
}
