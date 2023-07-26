import { Injectable } from '@angular/core';
import { combineLatest, delay, map, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as panel from './panel.json';

@Injectable({
  providedIn: 'root'
})
export class FakeDataService {

  constructor() { }

  // 觀察者模式 https://limeii.github.io/2019/07/rxjs-subject/
  private _callToActionAtTopSub = new BehaviorSubject({
    "content": "King's Birthday 2023 Delivery Details",
    "url": "landing/esgMarketing"
  });
  callToActionAtTop$ = this._callToActionAtTopSub.asObservable();
  setCallToActionAtTop<T>(Data: any) {
    this._callToActionAtTopSub.next(Data);
  }

  private _panelSub = new BehaviorSubject(panel);
  panel$ = this._panelSub.asObservable();
  setPanel<T>(Data: any) {
    this._panelSub.next(Data);
  }


  headerData$ = combineLatest([
    this.callToActionAtTop$,
    this.panel$
  ]).pipe(
    map(
      ([callToActionAtTop, panel]) => {
        // 可以做一些 Adapter 類似 DTO 在這
        return {
          callToActionAtTop: callToActionAtTop,
          panel: panel
        }
      }
    ),
    // delay(2000), // 模擬延遲
    tap(
      // (data) => console.log('data', data)
    )
  );

}
