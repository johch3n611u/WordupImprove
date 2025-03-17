import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toThousand'
})
export class ToThousandPipe implements PipeTransform {

  // https://hsuchihting.github.io/angular/20220119/1380020379/

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.toThousandNumber(value);
  }

  toThousandNumber(param: any) {
    const paramStr = param.toString();
    if (paramStr.length > 3) {
      return paramStr.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    return paramStr;
  }

}
