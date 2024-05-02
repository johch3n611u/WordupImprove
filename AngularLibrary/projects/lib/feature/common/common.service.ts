import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  /**
   * 滾動到特定的 HTML 元素
   * @param elementRef - 要滾動到的元素的 ElementRef
   */
  goToAnchor(elementRef: ElementRef): void {
    // 使用 scrollIntoView 方法滾動到指定的元素
    elementRef.nativeElement.scrollIntoView({
      // 使用平滑滾動效果
      behavior: 'smooth',
      // 將元素的開始位置滾動到視圖的開始位置
      block: 'start',
      // 將元素的開始邊緣對齊視圖的開始邊緣
      inline: 'start',
    });
  }

}
