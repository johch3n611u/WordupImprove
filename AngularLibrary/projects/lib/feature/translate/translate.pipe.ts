import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service'; // translate service

@Pipe({
  name: 'translate',
  pure: false // 使成為 impure
})

export class TranslatePipe implements PipeTransform {

  constructor(private translateService: TranslateService) { }

  transform(value: string): any {
    if (!value) return;
    return this.translateService.Instant(value);
  }
}

