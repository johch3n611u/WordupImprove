https://ithelp.ithome.com.tw/users/20112280/ironman/2093?page=1

## Facade Pattern

簡化複雜系統，提供統一的界面，隱藏了系統內部複雜性。

EX. 封裝表單相關的功能、方法和事件，提供簡單統一的介面供其他程式使用。

[NG 依賴注入](https://fullstackladder.dev/blog/2018/11/04/mastering-angular-20-ngmodule-providers/)

[useFactory](https://fullstackladder.dev/blog/2018/11/05/mastering-angular-21-ngmodule-providers-2/)

```typescript
import { facadeFactory, StateUtils } from '@spartacus/core';
import { FORM_CORE_FEATURE } from '../form-feature-name';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: FormFacade,
      feature: FORM_CORE_FEATURE,
      methods: [
        'getCompleteFormStepSuccess',
        'getCompleteFormStepError',
      ],
      async: true,
    }),
})
export abstract class FormFacade {
  abstract getCompleteFormStepSuccess(
    formId: string,
    formStepId: string
  ): Observable<boolean>;
  abstract getCompleteFormStepError(
    formId: string,
    formStepId: string
  ): Observable<boolean>;
}
```

## Loading Overlay Service

加载状态的管理控制。它包含了被观察的属性和方法，根据不同的进程ID来跟踪和控制加载过程。

[pipe distinctuntilchanged](https://rxjs-cn.github.io/learn-rxjs-operators/operators/filtering/distinctuntilchanged.html)：当前值与之前最后一个值不同时才将其发出。

[ES6 Map](https://pjchender.dev/javascript/js-map/)：當需要經常增添刪減屬性時，使用 Map 的效能會比 Object 來得好。
  
```typescript 
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { LogService } from '../log';

@Injectable({
  providedIn: 'root',
})
export class LoadingOverlayService {
  logger = this.logService.getLogger('LoadingOverlayService');
  private index = 0;
  private readonly isLoading$: Observable<boolean>;
  // 用于存储不同进程 ID 和加载状态之间的映射关系
  private processLoadingMap$: BehaviorSubject<Map<string, string>>;
  processEndState$ = new BehaviorSubject(undefined);
  constructor(protected logService: LogService) {
    this.processLoadingMap$ = new BehaviorSubject<Map<string, string>>(
      new Map()
    );
    // 通过处理 processLoadingMap$ 的变化，计算是否有正在进行的加载过程。
    this.isLoading$ = this.processLoadingMap$.pipe(
      map(processLoadingMap => {
        if (processLoadingMap) {
          return new Map( // 进行过滤，去除值为 undefined 或假值的条目
            [...processLoadingMap].filter(
              ([k, v]) => typeof v !== 'undefined' && v
            )
          );
        } else {
          return new Map();
        }
      }),
      map((processes: Map<string, string>) => {
        this.logger.debug('Loading processing count: ', processes.size);
        this.logger.debug('Active processes:', [processes.keys()]);
        return processes.size;
      }),
      distinctUntilChanged(),
      // 计算剩余条目的数量，并最终判断数量是否大于0，返回一个布尔值表示加载状态。
      map((count: number) => count > 0)
    );
  }

  // 获取加载状态。如果不提供processId参数，则直接返回isLoading$属性的值（一个Observable<boolean>）。如果提供了 processId 参数，则调用方法获取特定进程的加载状态。 
  public getLoadingStatus(processId?: string): Observable<boolean> {
    return !!!processId
      ? this.isLoading$
      : this.getProcessLoadingState(processId);
  }

  // 开始一个加载过程，并在开始之前检查该进程是否已经处于加载状态。
  public startLoadingWithLock(
    processId: string,
    shouldReturnBooleanInsteadOfThrowingError?: boolean
  ): boolean {
    let isLoading = false;
    // 通过调用方法来获取特定进程的加载状态
    this.getProcessLoadingState(processId)
      .pipe(
        // 通过 take(1) 操作符只订阅一次该状态
        take(1),
        tap(isProcessing => {
          isLoading = isProcessing;
        })
      )
      .subscribe();
    if (isLoading) {
      // 已经在加载中根据参数返回布尔值或抛出错误
      if (shouldReturnBooleanInsteadOfThrowingError) {
        return false;
      } else {
        throw new Error(`process is locked - processId: ${processId}`);
      }
    }
    // 不是加载中，则调用方法开始加载
    this.startLoading(processId);
    return true;
  }

  // 开始一个加载过程。
  public startLoading(processId?: string): string {
    this.logger.debug('Loading started for process', processId);
    if (!!!processId) {
      // 如果不提供 processId 参数，则会生成一个新的唯一进程 ID。
      processId = this.getNewProcessId();
    }
    // 它通过调用方法将该进程的加载状态设置为进行中，并返回进程 ID。
    this.setProcessLoadingState(processId);
    return processId;
  }

  // 结束一个加载过程。
  public endLoading(processId: string) {
    // 它接受一个processId参数，表示要结束的加载过程的进程ID。
    this.logger.debug('Loading ended for process', processId);
    // 获取当前的加载过程映射（Map对象）。
    const processLoadingMap = this.processLoadingMap$.getValue();
    // delete 从映射中删除指定的 processId
    processLoadingMap.delete(processId);
    // 通过 next 方法将更新后的加载过程映射发送给所有订阅了 processLoadingMap$ 的观察者。
    this.processLoadingMap$.next(processLoadingMap);
  }

  // 强制结束所有的加载过程。
  public forceEndAllLoading() {
    if (this.processLoadingMap$.getValue().size > 0) {
    // 检查 processLoadingMap$ 的大小，如果大于0，则输出警告信息表示还有正在运行的进程。
      this.logger.warn(
        `Requested to end all loading when there are still ${
          this.processLoadingMap$.getValue().size
        } process running`
      );
    }
    // 调用processLoadingMap$的 next 方法将加载过程映射重置为空的Map对象，从而强制结束所有的加载过程。
    this.processLoadingMap$.next(new Map<string, string>());
  }

  // 获取特定进程的加载状态。
  public getProcessLoadingState(processId: string): Observable<boolean> {
    return this.processLoadingMap$.pipe(
      // 根据指定的processId查找对应的加载状态。如果找到了加载状态，则返回true；否则返回false。
      map(processLoadingMap => !!processLoadingMap.get(processId))
    );
  }

  // 设置特定进程的加载状态。
  private setProcessLoadingState(processId: string): void {
    const processLoadingMap = this.processLoadingMap$.getValue();
    processLoadingMap.set(processId, new Date().toUTCString());
    this.processLoadingMap$.next(processLoadingMap);
  }

  // 生成一个新的进程ID。
  private getNewProcessId(): string {
    this.index++;
    return this.index.toString();
  }

  // 处理加载过程状态的更新。
  onProcessStateUpdate(result: string) {
    if (!result) {
      return;
    }
    this.processEndState$.next(result);
  }
}

``` 
  
## Addon Onetrust Service
  
可以幫助網站管理者遵守 GDPR 和其他隱私法律，同時保護使用者的隱私權，可能有的功能如同意彈窗、多語系、數據管理等功能。

## Auth

Connector > logout

          > getOtpToken

