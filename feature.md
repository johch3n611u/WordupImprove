https://ithelp.ithome.com.tw/users/20112280/ironman/2093?page=1

## Facade Pattern

簡化複雜系統，提供統一的界面，隱藏了系統內部複雜性。

EX. 封裝表單相關的功能、方法和事件，提供簡單統一的介面供其他程式使用。

[NG 依賴注入](https://ithelp.ithome.com.tw/articles/10207990)

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

## Debounce & Throttle => Queue

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { debounce, filter, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  // 緩衝不立即發出的資料
  private pending$ = new BehaviorSubject<any>([]);
  // 等待發出的資料
  public outgoing$ = new BehaviorSubject<any>([]);
  // 當符合條件時發出資料
  private isReadyToEmit$ = new Subject<boolean>();
  private ngUnsubscribe = new Subject();

  BUFFER_SIZE = 5;
  DEBOUNCE_TIME = 5000;

  constructor() {
    this.getPendingEvent().pipe(
      // 發出符合給定條件的值
      filter(items => items && items.length > 0),
      // 根據一個選擇器函數，捨棄掉在兩次輸出之間小於指定時間的發出值
      debounce(items =>
        timer(
          items.length >= Number(this.BUFFER_SIZE) ? 0 : (Number(this.DEBOUNCE_TIME))
        ),
      ),
      // 發出值，直到提供的 observable 發出值，它便完成
      takeUntil(this.ngUnsubscribe)
    ).subscribe(pendingItems => {
      // 分類：超過 BUFFER_SIZE 筆數則等待下一次發送
      const outgoingList = pendingItems.slice(0, Number(this.BUFFER_SIZE)) || [];
      const restOfPendingList = pendingItems.slice(outgoingList.length, pendingItems.length) || [];
      if (outgoingList.length > 0) {
        this.outgoing$.next(outgoingList);
        this.isReadyToEmit$.next(true);
      }
      this.pending$.next(restOfPendingList);
    });

    this.isReadyToEmit$.pipe(
      withLatestFrom(this.getOutgoingEvent()),
      switchMap(([isReadyToEmit, outgoingEvents]) => {
        return this.request(isReadyToEmit, outgoingEvents)
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      res => {
        this.clearOutgoingEvents();
      }
    );
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.ngUnsubscribe.complete();
  }

  add(event: any) {
    this.pending$.next([...this.pending$.getValue(), ...[event]]);
  }

  getPendingEvent() {
    return this.pending$.asObservable();
  }

  getOutgoingEvent() {
    return this.outgoing$.asObservable();
  }

  clearOutgoingEvents() {
    this.outgoing$.next([]);
  }

  request(isReadyToEmit: any, outgoingEvents: any): Observable<any> {
    return from(outgoingEvents);
  }
}
```

## Library

```
Auth > Connector        > Log Out
                        > Get Otp Token
       Guards           > guard
       HttpInterceptors > Group useExisting
                        > Auth
                        > Auth Token Fallback
                        > Convert Auth Error
       User Auth        > Config
                        > Facade
                        > Service > Config
                                  > State Persistence ( 持久化 Spartacus AuthStatePersistenceService )
                                  > Wrapper ( Spartacus AuthService )
                                  > First Sign In
                                  > Oauth Library Wrapper ( Spartacus OAuthLibWrapperService )
       Web Auth         > Biometric Toggle Switch ( 生物識別登錄 )
Base Store > Connector ( API GetSoming )
           > Facade
           > Store      > Actions ( Redux )
                        > Effects ( Redux )
                        > Reducers ( Redux )
                        > Selectors ( Redux )
Brand > Connector ( API GetSoming )
      > Facades
      > Store > Actions ( Redux )
              > Effects ( Redux )
              > Reducers ( Redux )
              > Selectors ( Redux )
Cart > Adaptors > Load All
                > Load
     > Components
     > Promotion Connector ( API GetSoming )
     > Connector ( API GetSoming )
     > Service > Active Cart
               > Cart Multi Buy
               > Cart Promotion
               > Cart Validation
               > Cart With Senior Citizen
               > Cart
               > Mini Cart
               > Shopping List
     > Store   > Actions ( Redux )
               > Effects ( Redux )
               > Reducers ( Redux )
               > Selectors ( Redux )
               > Save For Later
               > Error State
               > Checkout Delivery
Category > Connector ( API GetSoming )
         > Facades 
         > Service
         > Store > Some Others
         > Utils > Noramlize > Map Category Tree
Checkout > Adaptors > Checkout Citi
                    > Checkout Dbs
         > Service > Payment Gateway      > AmEx Payment Gateway 美國運通（American Express）
                                          > Amex2 Payment Gateway
                                          > Atome Payment Gateway 新加坡支付網關服務
                                          > Bill Payment Gateway
                                          > COD Payment Gateway ( Cash On Delivery )
                                          > Eft Payment Gateway ( Electronic Funds Transfer )
                                          > Estamp Payment Gateway ( Estamp Asia Pte Ltd )
                                          > Line Pay Payment Gateway
                                          > Member Points Payment Gateway
                                          > MPGS Payment Gateway ( Mastercard )
                                          > Octopus Payment Gateway 香港八達通
                                          > Union Pay Payment Gateway 中國銀聯
                   > Referral Tracking
         > Store > Some Others
Core > Adapters > CMS
                > Converters
     > Config
     > Exents > Page Meta Event ( GTM )
     > Guards > Card Loss
              > Order
              > Search 
              > Supplier
     > Http Interceptors > API
                         > Queue It
                         > Site Context
     > i18n
     > Models
     > Pipes > Abbreviated Number
             > Algolia Multilingual Field
             > Count Down
             > Date Diff
             > Day Of Week
             > Discount Display
             > Dynamic Translate
             > Error Translate
             > Filter Orders
             > Format File Size
             > Handle Price Value
             > List Filter
             > Negative Value
             > Order Cancel Reason
             > Order History Status
             > Replace All
             > Space Translate
             > String Array Reduce
             > Url
             > Unescape
     > Resolvers > Url
                 > Page Meta
     > Routing   > Scroll Position Restoration
                 > Store
     > Services > Captcha
                > CMS
                > CRM
                > Google Speech
                > Google Vision
                > Slot Defer Loading
                > Storefront
                > Auto Complete
                > Breakpoint
                > BuildInfo
                > Custom Site Context
                > Device Detector
                > Global Config
                > Go In Store ( GIS )
                > GTM
                > Insider
                > JSON Id
                > Loading Overlay
                > Log
                > Omni Chat
                > Page Click Event
                > Process Lock
                > Url Normalizer
                > Viewport Intersector
     > Utils > Loder Reducer
             > Rxjs Extends > BufferDebounceTime
                            > CombineReload
                            > DelayedRetry
                            > Switch Map If Nullable
     > Window
Error Handling > Config
               > Facade
               > Utils
Field Option   > Connectors
               > Facade
               > Models
               > Store
Form           > Field Accessors
               > Adapters
               > Components > Attachments
                            > Auto Suggestion
                            > Captcha
                            > Checkbox
                            > Checkbox Select All
                            > Date Select
                            > Display Text
                            > Error Message
                            > Input
                            > Mb Password
                            > Mb Password With Hints
                            > Moneyback Language
                            > OTP Email
                            > OTP Moneyback
                            > OTP SMS
                            > Radio Option
                            > Selective Product List
                            > Textarea
                            > Title
                            > Toggler
               > Config
               > Connectors
               > Facade
               > Loaders
               > Store
               > Validators
Http
Lazada 東南亞地區最大的電子商務平台之一
Multi Cart
Newsletter
( OCC ) Omni Commerce Connect 是新 SAP Commerce Cloud / 舊 Hybris Commerce Suite 的 API 
用於實現與不同商業系統的集成，例如 ERP 系統、支付系統、庫存系統等
OCC Commerce > Tracking Event Queue
               > Brand
               > Category
               > Product
               > Social Followers
               > Tracking Event
               > Related Keywords
               > Social Followers
Popup > Components > Direct Content
                   > Error
                   > Form
                   > i18n
                   > Popup
      > Config
      > Models
      > Service
Product > Components > Product Code
                     > Product Thumnbail
Routes
Shared  > Components > Breadcrumb
                     > Banner
                     > Banner Carousel
                     > Icon
                     > Icon Link
                     > Icon Link List
                     > Item Counter
                     > Link
                     > Media
                     > Nested Tab
                     > Paragraph
                     > Rating
                     > Responsive Banner
                     > Video
                     > Back To Top
                     > Loading
                     > Loading Overlay
                     > Notification
                     > Digit Only
                     > Checkbox
                     > Error Msg
                     > Input
                     > Multi Select
                     > Radio
                     > Select
        > Directives
        > Models
        > Services > Notification
                   > Swiper Reference
Social Media
SSR
Storefinder
User    > Account
        > Address
        > Buy It Again
        > Estamp
        > Ewallet
        > Notify Me
        > Order
        > Order History
        > Point Donation
        > Reciept
        > Review
        > Wishlist
Vop

```

