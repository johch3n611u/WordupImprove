import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  private nowDisplay: boolean = false;
  private _multilevelNavDisplay = new BehaviorSubject(this.nowDisplay);
  multilevelNavDisplay$ = this._multilevelNavDisplay.asObservable();
  SetMultilevelNavDisplay<T>() {
    this.nowDisplay = !this.nowDisplay;
    this._multilevelNavDisplay.next(this.nowDisplay);
  }
}
