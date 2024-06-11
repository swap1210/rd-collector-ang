import { AccountType } from './user.model';

interface InnerIcon {
  fontIcon: string;
}

export interface HeaderAction {
  label: string;
  styleClass: string;
  action: (param: any | null) => void;
  param?: any;
  accountType?: AccountType;
  innerIcon?: InnerIcon;
  mobileLabel: string;
  mobileStyleClass: string;
}
