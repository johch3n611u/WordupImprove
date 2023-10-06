import { Pipe, PipeTransform } from '@angular/core';

//  https://dev.to/this-is-angular/search-and-highlight-text-feature-using-angular-l98
//  <div [innerHtml]="coupon.name | highlight:searchKeyword:'full'">{{ name }}</div>

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: any, args: any, type?:string): unknown {

    if(!args) {
      return value
    };

    if(type === 'full'){
      const re = new RegExp("\\b("+args+"\\b)", 'igm');
      // $1 代表正則表達式中第一個捕獲群組（capturing group）所匹配到的文字。
      value = value.replace(re, '<span class="keyword">$1</span>');
    } else {
      const re = new RegExp(args, 'igm');
      // $& 代表整個正則表達式所匹配到的文字。
      value = value.replace(re, '<span class="keyword">$&</span>');
    }

    return value;
  }
}
