import { Injectable } from '@angular/core';
import { CommonUtil } from './common-util';

@Injectable({
  providedIn: 'root',
})
export class CommonUtilService {
  getImages(pImgKey: string): string {
    return CommonUtil.tempImgGallery[pImgKey];
  }

  getCommissionMetaData(): any {
    return CommonUtil.commissionMetaData;
  }
}
