https://ithelp.ithome.com.tw/users/20112280/ironman/2093?page=1

## 外觀模式 Facade

簡化複雜系統，提供統一的界面，隱藏了系統內部複雜性。

EX. 封裝表單相關的功能、方法和事件，提供簡單統一的介面供其他程式使用。

[NG 依賴注入](https://fullstackladder.dev/blog/2018/11/04/mastering-angular-20-ngmodule-providers/)

[useFactory](https://fullstackladder.dev/blog/2018/11/05/mastering-angular-21-ngmodule-providers-2/)

```typescript
import { Injectable } from '@angular/core';
import { facadeFactory, StateUtils } from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorModel } from '../../../core/models/error.model';
import { FormGroup } from '../controls/form-controls';
import { FORM_CORE_FEATURE } from '../form-feature-name';
import { Form } from '../models/form-models';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: FormFacade,
      feature: FORM_CORE_FEATURE,
      methods: [
        'getCompleteFormStepLoading',
        'getCompleteFormStepSuccess',
        'getCompleteFormStepError',
      ],
      async: true,
    }),
})
export abstract class FormFacade {
  abstract getCompleteFormStepLoading(
    formId: string,
    formStepId: string
  ): Observable<boolean>;
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

## 加载状态 loading-overlay Service

加载状态的管理控制。它包含了被观察的属性和方法来跟踪和控制加载过程。

5. 构造函数还初始化了isLoading$和processLoadingMap$属性。
   * isLoading$属性通过处理processLoadingMap$的变化，计算是否有正在进行的加载过程。它首先对processLoadingMap$进行过滤，去除值为undefined或假值的条目，然后计算剩余条目的数量，并最终判断数量是否大于0，返回一个布尔值表示加载状态。
   * processLoadingMap$属性是一个BehaviorSubject，初始时创建了一个空的Map对象。它用于存储不同进程ID和加载状态之间的映射关系。
6. getLoadingStatus方法用于获取加载状态。如果不提供processId参数，则直接返回isLoading$属性的值（一个Observable<boolean>）。如果提供了processId参数，则调用getProcessLoadingState方法获取特定进程的加载状态。
7. startLoadingWithLock方法用于开始一个加载过程，并在开始之前检查该进程是否已经处于加载状态。它通过调用getProcessLoadingState方法来获取特定进程的加载状态，并通过take(1)操作符只订阅一次该状态。然后，根据获取到的状态判断是否已经在加载中，如果是，则根据shouldReturnBooleanInsteadOfThrowingError参数返回布尔值或抛出错误。如果不是加载中，则调用startLoading方法开始加载。
8. startLoading方法用于开始一个加载过程。如果不提供processId参数，则会生成一个新的唯一ID作为进程ID。它通过调用setProcessLoadingState方法将该进程的加载状态设置为进行中，并返回进程ID。
9. endLoading方法用于结束一个加载过程。它接受一个processId参数，表示要结束的加载过程的进程ID。在方法中，它首先通过调用processLoadingMap$的getValue方法获取当前的加载过程映射（Map对象）。然后，它使用processLoadingMap的delete方法从映射中删除指定的processId。最后，通过调用processLoadingMap$的next方法将更新后的加载过程映射发送给所有订阅了processLoadingMap$的观察者。
10. forceEndAllLoading方法用于强制结束所有的加载过程。它首先检查processLoadingMap$的大小，如果大于0，则输出警告信息表示还有正在运行的进程。然后，它通过调用processLoadingMap$的next方法将加载过程映射重置为空的Map对象，从而强制结束所有的加载过程。
11. getProcessLoadingState方法用于获取特定进程的加载状态。它接受一个processId参数，表示要获取加载状态的进程ID。在方法中，它使用pipe和map操作符来获取processLoadingMap$的最新值，并根据指定的processId查找对应的加载状态。如果找到了加载状态，则返回true；否则返回false。
12. setProcessLoadingState方法用于设置特定进程的加载状态。它接受一个processId参数，表示要设置加载状态的进程ID。在方法中，它首先通过调用processLoadingMap$的getValue方法获取当前的加载过程映射（Map对象）。然后，它使用processLoadingMap的set方法将指定的processId与当前时间的字符串作为键值对存储到加载过程映射中。最后，通过调用processLoadingMap$的next方法将更新后的加载过程映射发送给所有订阅了processLoadingMap$的观察者。
13. getNewProcessId方法用于生成一个新的进程ID。它通过递增index变量的值来生成唯一的ID，并将其转换为字符串作为进程ID返回。
14. onProcessStateUpdate方法用于处理加载过程状态的更新。它接受一个result参数，表示加载过程的最终状态。在方法中，它首先检查result是否存在，如果不存在则直接返回。然后，它通过调用processEndState$的next方法将result作为下一个值发送给所有订阅了processEndState$的观察者。

总体而言，E2LoadingOverlayService是一个用于管理和控制加载状态的服务。它提供了开始、结束和获取加载状态的方法，并使用rxjs的Observable来跟踪加载状态的变化。通过使用processLoadingMap$属性，它可以同时管理多个加载过程，并根据不同的进程ID来获取和更新加载状态。

[pipe distinctuntilchanged](https://rxjs-cn.github.io/learn-rxjs-operators/operators/filtering/distinctuntilchanged.html)
  
```typescript 
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { LogService } from '../-log';

@Injectable({
  providedIn: 'root',
})
export class LoadingOverlayService {
  logger = this.logService.getLogger('LoadingOverlayService');
  private index = 0;

  private readonly isLoading$: Observable<boolean>;

  private processLoadingMap$: BehaviorSubject<Map<string, string>>;

  processEndState$ = new BehaviorSubject(undefined);

  constructor(protected logService: LogService) {
    this.processLoadingMap$ = new BehaviorSubject<Map<string, string>>(
      new Map()
    );
    this.isLoading$ = this.processLoadingMap$.pipe(
      map(processLoadingMap => {
        if (processLoadingMap) {
          return new Map(
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
      map((count: number) => count > 0)
    );
  }

  public getLoadingStatus(processId?: string): Observable<boolean> {
    return !!!processId
      ? this.isLoading$
      : this.getProcessLoadingState(processId);
  }

  public startLoadingWithLock(
    processId: string,
    shouldReturnBooleanInsteadOfThrowingError?: boolean
  ): boolean {
    let isLoading = false;
    this.getProcessLoadingState(processId)
      .pipe(
        take(1),
        tap(isProcessing => {
          isLoading = isProcessing;
        })
      )
      .subscribe();
    if (isLoading) {
      if (shouldReturnBooleanInsteadOfThrowingError) {
        return false;
      } else {
        throw new Error(`process is locked - processId: ${processId}`);
      }
    }
    this.startLoading(processId);
    return true;
  }

  public startLoading(processId?: string): string {
    this.logger.debug('Loading started for process', processId);
    if (!!!processId) {
      processId = this.getNewProcessId();
    }
    this.setProcessLoadingState(processId);
    return processId;
  }

  public endLoading(processId: string) {
    this.logger.debug('Loading ended for process', processId);
    const processLoadingMap = this.processLoadingMap$.getValue();
    processLoadingMap.delete(processId);
    this.processLoadingMap$.next(processLoadingMap);
  }

  public forceEndAllLoading() {
    if (this.processLoadingMap$.getValue().size > 0) {
      this.logger.warn(
        `Requested to end all loading when there are still ${
          this.processLoadingMap$.getValue().size
        } process running`
      );
    }
    this.processLoadingMap$.next(new Map<string, string>());
  }

  public getProcessLoadingState(processId: string): Observable<boolean> {
    return this.processLoadingMap$.pipe(
      map(processLoadingMap => !!processLoadingMap.get(processId))
    );
  }

  private setProcessLoadingState(processId: string): void {
    const processLoadingMap = this.processLoadingMap$.getValue();
    processLoadingMap.set(processId, new Date().toUTCString());
    this.processLoadingMap$.next(processLoadingMap);
  }

  private getNewProcessId(): string {
    this.index++;
    return this.index.toString();
  }

  onProcessStateUpdate(result: string) {
    if (!result) {
      return;
    }
    this.processEndState$.next(result);
  }
}

``` 
  

  
