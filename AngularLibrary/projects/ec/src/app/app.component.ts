import { Component } from '@angular/core';
import { TranslatePipe } from 'lib/feature/translate/translate.pipe';
import { FakeDataService, TranslateService } from 'lib/public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'ec-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  headerData$: Observable<any> = {} as Observable<any>;
  constructor(
    private fakeDataService: FakeDataService,
    private translatePipe: TranslatePipe,
    private translateService: TranslateService,
  ) {
    this.headerData$ = this.fakeDataService.headerData$;
  }

  ngOnInit(): void {
    this.translateService.use(window.navigator.language);
    console.log('測試繁tw簡cn', this.translatePipe.transform('hello world'));
  }
}
