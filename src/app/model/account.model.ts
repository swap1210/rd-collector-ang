import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';
import { AccountType } from './rd.user.profile.model.model';

export interface RDAccountChange {
  familyGroup: string;
  AccountNo: string;
  AccountName: string;
  CardNo: string;
  RdStartDate: Timestamp;
  Installment: number;
  Nominee?: string;
  CIFNo?: string;
  Phoneno?: string;
  Whatsapp: boolean;
  Enabled: boolean;
  AmountBilled: number;
  AmountCollected: number;
  AmountPaid: number;
  LastBilled?: Timestamp;
  LastCollected?: Timestamp;
  LastPaid?: Timestamp;
  LastUpdateBy: DocumentReference | string;
  LastUpdateOn: Timestamp;
  Alias?: string[];
  RdEndDate?: Timestamp;
  //future
  HomeLocation?: GeoPoint;
}

export interface RDAccount extends RDAccountChange {
  temp_account: DocumentReference | String;
  CreatedBy?: DocumentReference | String;
  CreatedOn: Timestamp;
  //to be user on later stage no need to store in firestore
  Usertype?: AccountType;
  AmountTillNow?: number;
  billingOrCollection?: string;
  maturity?: number;
}

//////

// export interface RDAccount {
//   familyGroup: string;
//   temp_account: DocumentReference | String;
//   Alias?: string[];
//   AccountName: string;
//   accountNo: string;
//   AmountBilled: number;
//   AmountCollected: number;
//   AmountPaid: number;
//   CardNo: string;
//   CIFNo?: string;
//   CreatedBy?: DocumentReference | String;
//   CreatedOn: Timestamp;
//   Enabled: boolean;
//   HomeLocation?: GeoPoint;
//   Installment: number;
//   LastBilled: Timestamp;
//   LastCollected: Timestamp;
//   LastPaid: Timestamp;
//   LastUpdateBy?: DocumentReference | string;
//   LastUpdateOn?: Timestamp;
//   Nominee?: string;
//   Phoneno?: string;
//   RdStartDate: Timestamp;
//   RdEndDate?: Timestamp;
//   Whatsapp: boolean;
//   //to be user on later stage no need to store in firestore
//   Usertype?: AccountType;
//   AmountTillNow?: number;
//   billingOrCollection?: string;
//   maturity: number;
// }

// export interface RDAccountChange {
//   familyGroup: string;
//   Alias?: string[];
//   AmountBilled: number;
//   AmountCollected: number;
//   AmountPaid: number;
//   Enabled: boolean;
//   RdEndDate: Timestamp;
//   LastBilled?: Timestamp;
//   LastCollected?: Timestamp;
//   LastPaid?: Timestamp;
//   Nominee?: string;
//   Phoneno?: string;
//   Whatsapp: boolean;
//   LastUpdateBy: DocumentReference | string;
//   LastUpdateOn: Timestamp;
// }
