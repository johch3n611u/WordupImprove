import { Component } from '@angular/core';
import { ThemeService } from 'lib/feature/theme/theme.service';
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
    private translateService: TranslateService,
    private themeService: ThemeService,
  ) {
    this.headerData$ = this.fakeDataService.headerData$;
  }

  ngOnInit(): void {
    this.translateService.Use(window.navigator.language);
    console.log(this.themeService.GetTheme())
    this.themeService.SetTheme(this.themeService.GetTheme());
  }
}
