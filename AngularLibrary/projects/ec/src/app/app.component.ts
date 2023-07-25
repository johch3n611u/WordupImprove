import { Component } from '@angular/core';
import { FakeService } from 'lib/public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'ec-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  headerData$: Observable<any> = {} as Observable<any>;
  constructor(private fakeService: FakeService) {
    this.headerData$ = this.fakeService.headerData$;
  }
}
