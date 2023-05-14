https://ithelp.ithome.com.tw/users/20112280/ironman/2093?page=1

## 外觀模式 Facade

根据檔案名稱「form.facade.ts」，我可以猜測這是一個 TypeScript 檔案，而 facade 通常表示外觀模式（Facade Pattern）。根據這些資訊，這支程式可能是一個與表單相關的外觀模式的實作。
外觀模式是一種軟體設計模式，旨在簡化一個複雜系統的介面。它提供了一個統一的界面，使得客戶端能夠方便地與系統進行交互，同時隱藏了系統內部的複雜性。
根據這個假設，form.facade.ts 可能定義了一個表單相關的外觀模式類別，該類別可能封裝了表單相關的功能、方法和事件，以提供一個簡單且統一的介面供其他程式使用。然而，僅憑檔案名稱並無法確定程式的確切功能，因為命名慣例可能因不同的開發團隊或專案而有所不同。

<details>
<summeny>aaa</summeny>
</details>

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

## loading-overlay

这段代码是一个 Angular 服务（Service），名为E2LoadingOverlayService。它是一个可注入（Injectable）的服务，意味着它可以在其他组件或服务中进行注入和使用。

代码的主要目的是提供加载状态的管理和控制。它包含了一些被观察的属性和方法来跟踪和控制加载过程。下面是对代码的详细解释：

1. 首先，代码导入了一些 Angular 相关的依赖和rxjs相关的依赖。
2. 在@Injectable装饰器下，定义了E2LoadingOverlayService类，并且使用"root"作为注入器（在根模块中提供服务）。
3. 类中的属性包括：
   * logger: 一个用于日志记录的对象。
   *index: 一个计数器，用于生成唯一的进程ID。
   *isLoading$: 一个被观察的属性（Observable），用于跟踪是否有加载正在进行。
   *processLoadingMap$: 一个BehaviorSubject对象，作为加载过程的映射（使用Map数据结构存储）。
   *processEndState$: 一个BehaviorSubject对象，用于通知加载过程的结束状态。
4. 构造函数中，接受一个E2LogService的实例作为参数，并使用该实例创建了logger属性。
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
