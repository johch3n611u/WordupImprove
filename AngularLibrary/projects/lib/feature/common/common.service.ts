import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  // 移動到元素參考
  goToAnchor(elementRef: ElementRef) {
    elementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

}
