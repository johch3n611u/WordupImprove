import { Component } from '@angular/core';
import { FakeDataService } from 'lib/public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'ec-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  headerData$: Observable<any> = {} as Observable<any>;
  constructor(private fakeDataService: FakeDataService) {
    this.headerData$ = this.fakeDataService.headerData$;
  }
}
