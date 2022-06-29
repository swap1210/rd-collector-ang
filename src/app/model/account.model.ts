// import { firestore } from '@angular/fire';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { GeoPoint, Timestamp } from '@angular/fire/firestore';
import { AccountType } from './user.model';

export interface RDAccount {
  temp_account: DocumentReference | String;
  Alias?: string[];
  AccountName: string;
  AccountNo: string;
  AmountBilled: number;
  AmountCollected: number;
  AmountPaid: number;
  CardNo: string;
  CIFNo?: string;
  CreatedBy?: DocumentReference | String;
  CreatedOn: Timestamp;
  Enabled: boolean;
  HomeLocation?: GeoPoint;
  Installment: number;
  LastBilled: Timestamp;
  LastCollected: Timestamp;
  LastPaid: Timestamp;
  LastUpdateBy?: DocumentReference | string;
  LastUpdateOn?: Timestamp;
  Nominee?: string;
  Phoneno?: string;
  RdStartDate: Timestamp;
  RdEndDate?: Timestamp;
  Whatsapp: boolean;
  //to be user on later stage no need to store in firestore
  Usertype?: AccountType;
  AmountTillNow?: number;
  billingOrCollection?: string;
  maturity: number;
}

export interface RDAccountChange {
  Alias?: string[];
  AmountBilled: number;
  AmountCollected: number;
  AmountPaid: number;
  Enabled: boolean;
  RdEndDate: Timestamp;
  LastBilled?: Timestamp;
  LastCollected?: Timestamp;
  LastPaid?: Timestamp;
  Nominee?: string;
  Phoneno?: string;
  Whatsapp: boolean;
  LastUpdateBy: DocumentReference | string;
  LastUpdateOn: Timestamp;
}
