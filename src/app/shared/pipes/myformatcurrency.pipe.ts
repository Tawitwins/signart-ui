import { Pipe, PipeTransform, LOCALE_ID} from '@angular/core';
import {formatCurrency, getCurrencySymbol, } from '@angular/common'
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
//Documentation sur ==> https://angular.io/api/common/CurrencyPipe
registerLocaleData(localeFr, 'fr');

@Pipe({
  name: 'myformatcurrency'
})
export class MyformatcurrencyPipe implements PipeTransform {

  transform(
    value: number,
    currencyCode: string = 'XOF',
    display: string= 'symbol',
    digitsInfo: string = '',
    locale: string = 'fr',
): string | null {
    return formatCurrency(
      value,
      locale,
      getCurrencySymbol(currencyCode, 'wide'),
      currencyCode,
      digitsInfo,
    );
    }
}
