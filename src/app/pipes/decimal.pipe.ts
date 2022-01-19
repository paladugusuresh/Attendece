import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalPipe implements PipeTransform {
  transform(item: any, fraction: number): any {
    if (!item) {
      return '0';
    }
    const digits = String(item);
    fraction = fraction || digits.length;
    if (digits.indexOf('.') < 0) {
        let trailingPart = '';
        for (let index = 0; index < fraction; index++) {
            trailingPart+='0';
        }
        return `${item}.${trailingPart}`;
    }
    if (fraction === digits.length) {
        return item;
    }
    return String(item).substring(0, digits.indexOf('.') + 1 + fraction);
  }
}
