import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
// import { LogService } from '../log';

@Injectable({
  providedIn: 'root',
})
export class LoadingOverlayService {
  // logger = this.logService.getLogger('LoadingOverlayService');
  private index = 0;
  private readonly isLoading$: Observable<boolean>;
  // 用於存儲不同進程 ID 和加載狀態之間的映射關係
  private processLoadingMap$: BehaviorSubject<Map<string, string>>;
  processEndState$ = new BehaviorSubject(undefined);
  constructor(
    // protected logService: LogService
  ) {
    this.processLoadingMap$ = new BehaviorSubject<Map<string, string>>(
      new Map()
      // https://pjchender.dev/javascript/js-map/
      // ES6 Map 當需要經常增添刪減屬性時，使用 Map 的效能會比 Object 來得好
    );
    // 通過處理 processLoadingMap$ 的變化，計算是否有正在進行的加載過程
    this.isLoading$ = this.processLoadingMap$.pipe(
      map(processLoadingMap => {
        if (processLoadingMap) {
          return new Map( // 進行過濾，去除值為 undefined 或假值的條目
            [...processLoadingMap].filter(
              ([k, v]) => typeof v !== 'undefined' && v
            )
          );
        } else {
          return new Map();
        }
      }),
      map((processes: Map<string, string>) => {
        // this.logger.debug('Loading processing count: ', processes.size);
        // this.logger.debug('Active processes:', [processes.keys()]);
        return processes.size;
      }),
      distinctUntilChanged(),
      // 計算剩餘條目的數量，並最終判斷數量是否大於0，返回一個布爾值表示加載狀態
      // https://rxjs-cn.github.io/learn-rxjs-operators/operators/filtering/distinctuntilchanged.html
      // 當前值與之前最後一個值不同時才將其發出
      map((count: number) => count > 0)
    );
  }

  // 獲取加載狀態。如果不提供processId參數，則直接返回isLoading$屬性的值（一個Observable<boolean>）。如果提供了 processId 參數，則調用方法獲取特定進程的加載狀態
  public getLoadingStatus(processId?: string): Observable<boolean> {
    return !!!processId
      ? this.isLoading$
      : this.getProcessLoadingState(processId);
  }

  // 開始一個加載過程，並在開始之前檢查該進程是否已經處於加載狀態
  public startLoadingWithLock(
    processId: string,
    shouldReturnBooleanInsteadOfThrowingError?: boolean
  ): boolean {
    let isLoading = false;
    // 通過調用方法來獲取特定進程的加載狀態
    this.getProcessLoadingState(processId)
      .pipe(
        // 通過 take(1) 操作符只訂閱一次該狀態
        take(1),
        tap(isProcessing => {
          isLoading = isProcessing;
        })
      )
      .subscribe();
    if (isLoading) {
      // 已經在加載中根據參數返回布爾值或拋出錯誤
      if (shouldReturnBooleanInsteadOfThrowingError) {
        return false;
      } else {
        throw new Error(`process is locked - processId: ${processId}`);
      }
    }
    // 不是加載中，則調用方法開始加載
    this.startLoading(processId);
    return true;
  }

  // 開始一個加載過程
  public startLoading(processId?: string): string {
    // this.logger.debug('Loading started for process', processId);
    if (!!!processId) {
      // 如果不提供 processId 參數，則會生成一個新的唯一進程 ID
      processId = this.getNewProcessId();
    }
    // 它通過調用方法將該進程的加載狀態設置為進行中，並返回進程 ID
    this.setProcessLoadingState(processId);
    return processId;
  }

  // 結束一個加載過程
  public endLoading(processId: string) {
    // 它接受一個processId參數，表示要結束的加載過程的進程ID
    // this.logger.debug('Loading ended for process', processId);
    // 獲取當前的加載過程映射（Map對象）
    const processLoadingMap = this.processLoadingMap$.getValue();
    // delete 從映射中刪除指定的 processId
    processLoadingMap.delete(processId);
    // 通過 next 方法將更新後的加載過程映射發送給所有訂閱了 processLoadingMap$ 的觀察者
    this.processLoadingMap$.next(processLoadingMap);
  }

  // 强強制結束所有的加載過程
  public forceEndAllLoading() {
    if (this.processLoadingMap$.getValue().size > 0) {
      // 檢查 processLoadingMap$ 的大小，如果大於0，則輸出警告信息表示還有正在運行的進程
      // this.logger.warn(
      //   `Requested to end all loading when there are still ${
      //     this.processLoadingMap$.getValue().size
      //   } process running`
      // );
    }
    // 調用processLoadingMap$的 next 方法將加載過程映射重置為空的Map對象，從而強制結束所有的加載過程
    this.processLoadingMap$.next(new Map<string, string>());
  }

  // 獲取特定進程的加載狀態
  public getProcessLoadingState(processId: string): Observable<boolean> {
    return this.processLoadingMap$.pipe(
      // 根據指定的 processId 查找對應的加載狀態。如果找到了加載狀態，則返回 true；否則返回 false
      map(processLoadingMap => !!processLoadingMap.get(processId))
    );
  }

  // 設置特定進程的加載狀態
  private setProcessLoadingState(processId: string): void {
    const processLoadingMap = this.processLoadingMap$.getValue();
    processLoadingMap.set(processId, new Date().toUTCString());
    this.processLoadingMap$.next(processLoadingMap);
  }

  // 生成一個新的進程 ID
  private getNewProcessId(): string {
    this.index++;
    return this.index.toString();
  }

  // 處理加載過程狀態的更新
  onProcessStateUpdate(result: string) {
    if (!result) {
      return;
    }
    // this.processEndState$.next(result);
  }
}