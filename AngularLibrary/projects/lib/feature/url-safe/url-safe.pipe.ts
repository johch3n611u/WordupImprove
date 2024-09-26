import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

// https://stackoverflow.com/questions/37927657/img-unsafe-value-used-in-a-resource-url-context
// {{ data.url | safe:'url' }}
// this.safePipe.transform('<h1>Hi</h1>', 'html');

@Pipe({
  name: 'urlSafe',
})
export class UrlSafePipe implements PipeTransform {

  constructor(
    protected _sanitizer: DomSanitizer
  ) { }

  transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this._sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this._sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this._sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}

