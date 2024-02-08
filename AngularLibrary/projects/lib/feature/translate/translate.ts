import { InjectionToken } from '@angular/core';

// 引進我們的語言檔案包
// import { LANG_TW_NAME, LANG_TW_TRANS } from '../../assets/mods/i18n/lazg-tw';
// import { LANG_CN_NAME, LANG_CN_TRANS } from '../../assets/mods/i18n/lazg-cn';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// 翻譯辭典
// const dictionary = {
//     [LANG_TW_NAME]: LANG_TW_TRANS,
//     [LANG_CN_NAME]: LANG_CN_TRANS,
// };

// providers
export const TRANSLATION_PROVIDERS = (tranSetting: TranSetting) => {
  return [
    { provide: TRANSLATIONS, useValue: tranSetting },
  ]
};

export interface TranSetting {
  [key: string]: any;
}
