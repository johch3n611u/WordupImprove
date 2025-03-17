import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Optional } from '@angular/core';

export enum Theme {
  dark = 'dark',
  light = 'light',
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    @Optional() @Inject(PLATFORM_ID) private platformId: string
  ) {

  }

  setTheme(theme: Theme) {
    const htmlNode = document.getElementsByTagName('html')[0];
    htmlNode.setAttribute('data-theme', theme);
    localStorage.setItem('FAVORITE_THEME', theme);
  }

  getTheme(): Theme {
    const cacheTheme = localStorage.getItem('FAVORITE_THEME');
    if (cacheTheme) {
      return cacheTheme === Theme.dark ? Theme.dark : Theme.light;
    }
    if (isPlatformBrowser(this.platformId)) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return Theme.dark;
      }
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return Theme.light;
      }
    }
    const curHour = new Date().getHours();
    const isNight = curHour >= 19 || curHour <= 6;
    return isNight ? Theme.dark : Theme.light;
  }
}
