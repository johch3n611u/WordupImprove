import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  constructor() { }

  // 觀察者模式 https://limeii.github.io/2019/07/rxjs-subject/
  private _behaviorSubject = new BehaviorSubject({
    "callToActionAtTop": {
      "content": "King's Birthday 2023 Delivery Details",
      "url": "landing/esgMarketing"
    },
    "panel": {

    }
  });
  layoutData$ = this._behaviorSubject.asObservable();
  SetShareLayoutData<T>(Data: any) {
    this._behaviorSubject.next(Data);
  }
}
