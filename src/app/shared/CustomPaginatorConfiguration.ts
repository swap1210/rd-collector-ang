import { MatPaginatorIntl } from '@angular/material/paginator';
import { CU } from './comm-util';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  let lang = sessionStorage.getItem('language');

  lang = lang ? lang : 'hi';
  console.log('language', lang);
  customPaginatorIntl.itemsPerPageLabel = CU.t(
    lang,
    'एक बार में कितने खाते देखने हैं: '
  );

  return customPaginatorIntl;
}
