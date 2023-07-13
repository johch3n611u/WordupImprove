import { Component } from '@angular/core';
import { FakeService } from 'lib/public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'ec-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  layoutData$: Observable<any> = {} as Observable<any>;
  constructor(private fake: FakeService) {
    this.layoutData$ = this.fake.layoutData$;
  }
}
