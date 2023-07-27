// https://stackoverflow.com/questions/55581378/angular-7angular-core-core-has-no-exported-member-opaquetoken
// 設計參數 new InjectionToken
// https://stackoverflow.com/questions/42396804/how-to-write-a-service-that-requires-constructor-parameters
// 設計動態參數

import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translate'; // import our opaque token

@Injectable()
export class TranslateService {
  private _currentLang: string = '';

  public get currentLang() {
    return this._currentLang;
  }

  // inject our translations
  constructor(
    @Inject(TRANSLATIONS) private _translations: any
  ) {
  }

  public use(lang: string): void {
    // set current language
    this._currentLang = lang;
  }

  private translate(key: string): string {
    // private perform translation
    let translation = key;

    if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
      return this._translations[this.currentLang][key];
    }

    return translation;
  }

  public instant(key: string) {
    // call translation
    return this.translate(key);
  }
}
