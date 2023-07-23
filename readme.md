# 專案要點

1. 所有東西 ( gitBranch、filesArchitecture、communicate ) 都越扁平越好並保持 DRY 原則，能夠快速釐清、整合、決策、執行，避免延伸非必要的任何事情
2. 用新的 [pnpm](https://zhuanlan.zhihu.com/p/546400909) 進行模組管理，指令同 npm
3. [NG-ZORRO](https://ng.ant.design/docs/introduce/en) 參考較多人使用的 UI Repo 去產結構，以 feature 業務邏輯對原生 element 或第三方元件庫進行二次封裝
4. 新模組或元件 / 功能需先查詢此文檔有無類似功能並優化重構，如無則需補上說明文件與路徑
5. 找不到功能應用開發可以參考以下項目
6. 盡量補上測試或至少保留原生單元測試
   * unit `ng test` [Karma](https://karma-runner.github.io)
   * end-to-end `ng e2e` 端對端測試的套件最多人使用的是 Protractor
7. 用 [Markdown All in One: Create Table of Contents](https://zhuanlan.zhihu.com/p/126353341) 自動產生 github 目錄

## 專案架構與文檔

### Facade Pattern

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

### Loading Overlay Service

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
  
### Addon Onetrust Service
  
可以幫助網站管理者遵守 GDPR 和其他隱私法律，同時保護使用者的隱私權，可能有的功能如同意彈窗、多語系、數據管理等功能。

### Debounce & Throttle => Queue

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

### Large EC Project Architecture

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

----------------------------------------------------
## 基本知識
### Node.js V8

* 介紹：Node.js 是一個能夠在伺服器端執行 JavaScript 的平台，其背後所使用的引擎是 Google 以  C++ 開發的 V8 引擎。
* 包管理系統：Node.js 預設附帶的包管理系統為 npm (Node Package Manager)，可透過此系統方便地管理套件。
* 常見差異與選擇：在使用 Node 以前前端多是由 cdn 或本地 implicit dependency 隱式依賴 js 容易造成相依問題，沒辦法清楚看到程式碼依賴外部的函式庫、依賴不存在，或者引入順序錯誤，應用程序將無法正常運行、依賴被引入但是並沒有使用，瀏覽器將被迫下載無用代碼；
* 使用方法：透過指令安裝 Node.js 後，即可透過 npm 或 Yarn 來安裝套件。
* 安裝與使用套件：透過指令 npm install 或 yarn add，即可安裝相應套件，並透過 require 或 import 語法將套件引入專案。
* 套件版本控制：透過 package.json 可以管理專案所使用套件的版本，避免產生相容性問題。

### NPM、Yarn、Nuget

* 介紹：NPM、Yarn、Nuget 均為套件管理系統，NPM 是 Node.js 的官方套件管理工具，Yarn 是 Facebook 開發的套件管理工具，Nuget 則是專為 .NET 平台而設計的套件管理工具。
* 常見差異與選擇：NPM 與 Yarn 在功能上大致相同，Yarn 擁有較快的速度及更好的穩定性；Nuget 則是針對 .NET 平台的套件管理，具有專為 .NET 開發者所設計的功能。
* 使用方法：透過指令安裝相應的套件管理工具後，即可透過指令安裝、更新、移除套件。
* 安裝與使用套件：透過指令 install 或 add，即可安裝相應套件，並透過 require 或 import 語法將套件引入專案。
* 套件版本控制：透過相應套件管理工具的版本控制系統，可控制套件版本。

### Webpack

* 參考：[為什麼前端需要工程化？ — webpack](https://ithelp.ithome.com.tw/articles/10214480)、[關於 Webpack，它是什麼？能夠做什麼？為什麼？怎麼做？— freeCodeCamp 的筆記](https://askie.today/what-is-webpack/)、[[note] Webpack 學習筆記](https://pjchender.dev/webpack/note-webpack/)
* 介紹：Webpack 也是一種 NPM 套件由 Js 編寫並執行於 Nodejs，是一個 JavaScript 模組打包工具，能夠將多個 JavaScript 檔案及相關資源整合打包成一個或多個 bundle，以利於網頁應用程式的載入。
* 為什麼前端需要工程化？：在較複雜的網頁應用程式中，前端開發人員需要管理大量的 JavaScript 檔案及相關資源，以便組成一個完整的網頁應用程式。此時，使用 Webpack 等工具能夠自動化打包、壓縮、優化及管理程式碼，並透過模組化方式來提高程式碼的可維護性、可擴展性及可重用性。
* 使用方法：透過指令安裝 Webpack 後，需設定相關的配置檔案，以定義打包的規則及輸出的 bundle。
* 基本概念：entry、output、loader、plugin 等概念是 Webpack 中常用的概念，需了解其用途與作用。
* 設定檔案與模組化：透過配置檔案可定義不同的打包規則，並透過模組化方式將程式碼分割成較小的部分，以便進行打包、壓縮及管理。
* 常見功能：
  * 載入不同檔案格式：Webpack 可載入 JavaScript、CSS、圖片、字型等不同類型的檔案。
  * Code Splitting：將應用程式中的程式碼分割成多個 bundle，以利於加速載入時間。
  * 最佳化打包程式碼：透過壓縮、混淆、Tree Shaking 等技術，可大幅減少打包後的檔案大小及加速載入時間。
  * Webpack 的 Hot Module Replacement (HMR) 是一种工具，它可以在运行中更新你的 Web 应用程序，而无需重新加载整个页面。这样可以大大提高开发效率，因为你可以在修改代码后立即看到结果。
  * 模块解析：Webpack 会解析你的模块，并尝试将它们打包到输出文件中。如果某个模块存在问题，Webpack 会输出错误信息，并指出出现错误的模块和文件路径。
  * 插件和 Loader：Webpack 使用插件和 Loader 来处理不同类型的资源。如果插件或 Loader 存在问题，Webpack 会输出错误信息，并指出出现错误的插件或 Loader 名称和文件路径。
  * 语法检查：Webpack 会使用 ESLint 或者类似的工具来检查你的代码是否符合规范和语法。如果代码存在语法错误，Webpack 会输出错误信息，并指出出现错误的文件和行数。

### Gulp、Grunt、Parcel、Browserify、PUG、SASS、Babel

* 介紹：Gulp、Grunt、Parcel、Browserify、PUG、SASS、Babel 均為前端工具，都可以運行於nodejs，能夠協助前端開發人員加速開發、提高可維護性及可重用性等。
* 使用方法：透過指令安裝相應的工具後，需設定相關的配置檔案，以定義其使用方式及相應的規則。
* 基本功能介紹：
  * Gulp：自動化執行任務，如編譯 SASS、壓縮圖片等。
  * Grunt：自動化執行任務，如編譯 SASS
  * Parcel：快速打包 JavaScript、CSS、HTML 等檔案，且不需要進行設定，是一個快速上手的打包工具。
  * Browserify：透過 CommonJS 的方式，讓前端可以像後端一樣進行模組化開發，並透過 Browserify 進行打包及管理。
  * PUG：一種靈活的 HTML 模板語言，透過簡潔的語法，能夠讓 HTML 更易讀、更易維護。
  * SASS：一種 CSS 的前處理器，提供了更多的功能及擴展，如變數、巢狀規則、函式等，以便更有效率地編寫 CSS。
  * Babel：一個 JavaScript 編譯器，能夠將 ES6+ 轉換為 ES5，並支援一些最新的 JavaScript 語法及擴展。
  * ESLint：ESLint 是一个 JavaScript 代码检查工具，它可以帮助你根据你的配置文件检查 JavaScript 代码中的潜在问题和错误，并提供修复建议和规范约束。
  * Create React App：是React框架的官方腳手架工具，用於創建新的React應用程序。它提供了一個基本的React項目模板，並且在項目中集成了常用的開發工具，例如Webpack和Babel。它還提供了一些有用的功能，例如熱加載和自動代碼重載，以便開發人員可以快速迭代他們的應用程序。
  * Angular CLI：是Angular框架基於 Typescript 的官方命令行界面，可以幫助你創建、構建和部署Angular應用程序。它提供了一些常用的命令，例如創建新的Angular應用程序、生成新的組件、生成新的服務器、運行開發服務器等等。提供了預設的 webpack 設定檔，會將 TypeScript、Sass、Less、Stylus、PostCSS、ES6 等輸入檔案編譯，允許你透過 ng eject 指令來擷取出 webpack 設定檔案，然後進行自訂。

### Angular AOT / JIT / Ivy / Esbuild

* 參考：[NG 13 use  esbuild](https://www.reddit.com/r/Angular2/comments/10by6fg/comment/j4dpiux/)
* AOT：(Ahead-of-Time) 是一種編譯模式，是指在構建應用程序時將模板編譯為本機JavaScript代碼。這樣一來，當用戶訪問應用程序時，可以直接載入編譯後的JavaScript代碼，減少了代碼解析和編譯的時間。這樣可以提高應用程序的性能和加載速度。
* JIT：是一種編譯模式，在用戶運行應用程序時，即時編譯模板，轉換成本機JavaScript代碼。這樣做的好處是可以快速地開發和調試應用程序，因為在開發過程中可以即時看到模板的變化。
* Ivy：是Angular的新的渲染引擎，取代了舊的View Engine，它提供更高效的編譯和更快的啟動時間。它還支持更小的應用程序大小，更好的應用程序性能和更強大的模板編譯功能。
* Esbuild：esbuild 是一款快速的 JavaScript 构建工具，能够快速将 JavaScript、CSS 和其他资源文件打包成可部署的文件。这款工具具有快速的构建速度和高效的编译能力，可以显著提高应用程序的构建速度。虽然 Angular 没有直接使用 esbuild，但它使用了基于 esbuild 的工具 * ng-packagr 来打包 Angular 应用。ng-packagr 是一款在 Angular 5.0 版本中引入的打包工具，它默认使用 Webpack 作为打包引擎，但从 Angular 11.0 版本开始，ng-packagr 默认使用 esbuild 作为主要的打包引擎，以提高打包速度和性能。

### Vite

* 參考：[Native ESM、esbuild、HMR](https://ithelp.ithome.com.tw/m/users/20139636/ironman/3890)
* 介紹：Vite 是一個快速開發工具，能夠幫助前端開發人員快速開發網頁應用程式，並支援原生的 ESM (ES6 模組化)。
* 比較其他工具的優勝點：Vite 比起其他工具更快的原因在於使用了 esbuild 進行打包，且支援 Hot Module Replacement (HMR) 技術，能夠讓開發人員在修改程式碼時，即時地看到修改後的結果。
* 使用方法：透過指令安裝 Vite 後，可透過相應的配置檔案來進行設定及開發。
* 開發環境設定：Vite 預設使用本機端的網頁伺服器，以提高開發效率。

### 建立元件庫

#### 建立 Angular 元件庫

* [使用AngularCli搭配ng-packagr建立元件](https://jiaming0708.github.io/2018/06/13/angular-cli-packagr/)
* [Storybook UI View](https://ithelp.ithome.com.tw/articles/10245423)
* [手把手教你搭建自己的Angular元件庫](https://segmentfault.com/a/1190000022637243)

```bat
npm install --global yarn
yarn add @angular/cli
ng new <project>
cd <project>
ng generate library <library> --prefix <library>
--prefix 會更改 app-xxx 為新前綴 library-xxx
```

![prefix](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/prefix.png)

如果要改 layout 需要同步修改配置檔的對應路徑

![layout](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/libraryLayoutPath.png)

SecondaryExport

![SecondaryExport](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/secondaryExport.png)

設定完 tsconfig.json 即可 HMR

![HMR](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/HMR.png)

#### Angula StoryBook

[Storybook for Angular tutorial](https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/)

[玩轉 Storybook 系列](https://ithelp.ithome.com.tw/users/20130417/ironman/3608)

[Storybook | 說說元件的故事吧！](https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/storybook-tutorial-90189a4d0275)

[PJCHENder [npm] Storybook](https://pjchender.dev/npm/npm-storybook/)

* yarn 才能解依賴 bug，npm 需要自己手動一個個解依賴
* .storybook 設定檔的內容並不會熱重載，修改後需要重啟
* @storybook/addon-essentials：是一個 Storybook 的擴充套件（addon），其目的是簡化 Storybook 的使用流程，提供一些常用的功能和工具，以便更容易地開發和測試 React、Vue、Angular 等前端框架的 UI 組件。
  * actions：用於在 Storybook 中模擬 UI 組件的事件和行為，方便進行測試和開發。
  * controls：用於在 Storybook 中動態調整 UI 組件的 props 值，以便快速測試不同的使用場景。
  * docs：用於在 Storybook 中生成組件的說明文檔，方便開發者記錄和共享組件的使用方式和注意事項。
  * viewport：用於在 Storybook 中模擬不同的設備和屏幕尺寸，以便測試 UI 組件在不同環境下的表現。
  * backgrounds：用於在 Storybook 中設置不同的背景色或背景圖片，以便測試 UI 組件在不同背景下的可讀性和美觀度。
* .storybook/preview.js
  * 設置全局的樣式和主題，包括 CSS 文件、字體、配色等，以便在預覽模式中使用。
  * 設置全局的 decorators 和 parameters，用於對預覽組件進行修飾和設置，如添加圖標、* 設置尺寸等。
  * 設置全局的資源路徑和模組別名，以便在預覽模式中載入組件需要的資源和模組。
  * 設置全局的動畫和交互效果，如 hover、click 等，以便在預覽模式中模擬不同的使用場景。
* @storybook/addon-ally：供了一個 UI 界面和一個 CLI 工具，用於自動檢查 Storybook 中的所有組件，並生成一份詳細的可訪問性報告
  * 可訪問性問題的類型和嚴重程度，如缺少 alt 屬性、鍵盤焦點問題等。
  * 有問題的組件代碼和說明，以便開發者快速定位和修復問題。
  * 建議的修復方案和參考資料，以便開發者了解如何解決可訪問性問題。
* Storybook Manager：是一個獨立的 Web 應用程序，用於管理 Storybook 中的所有故事（stories），包括組件的列表、搜索功能、組件的層次結構、主題選擇器等。
* storybook/manager.js：文件可以用於修改和擴展 Storybook Manager 的功能和外觀
  * 修改 Manager 的標題和標誌，以適應特定項目或品牌。
  * 添加自定義的項目篩選器，以便開發者快速找到特定類型的組件。
  * 修改 Manager 的佈局和樣式，以適應不同的屏幕大小和設備。
  * 添加自定義的插件和小部件，以擴展 Manager 的功能和組件庫。

####　Storybook 5.2 ↑ Component Story Format (CSF)

一個 CSF 會包含一個 

Export default 描述一個元件故事的基本設定

包含多個 Named export 描述一個元件可能會出現的各種故事

[玩轉 Storybook: Day 06 Component Story Format](https://ithelp.ithome.com.tw/articles/10240995)

#### Jest

[今天我想來在 Angular 應用程式上加上測試保護 系列](https://ithelp.ithome.com.tw/users/20109645/ironman/5708)

#### 建立 React 元件庫

> `TL;DR` 綜合環境不好建置最好直接找現成的整合方案

* [Create a React component library with Vite and Typescript](https://dev.to/nicolaserny/create-a-react-component-library-with-vite-and-typescript-1ih9)：此為使用 Vite 及 TypeScript 建立 React 元件庫的教學，可透過此教學了解如何建立一個可重複使用的 React 元件庫，並透過 Vite 進行開發、打包及發布等流程。
  * Speedy Web Compiler：(SWC)是一個用Rust撰寫的線上程式碼編譯器，可視為Babel的替代品。它比Babel更快，可以單線程運行20倍，使用四個核心可以運行70倍。SWC目前被Next.js預設選擇作為compiler，也被Deno用來加速TypeScript的啟動速度，Vite 支援 SWC。
  * Monorepo：你真的懂Monorepo？五分鐘帶你認識前端大型架構、為什麼前端工程越來越愛使用 Monorepo 架構
  * Npm v7 Workspaces：它允許在同一個 repository 內的多個 package 中共用相同的 node_modules，搭配 Monorepo，方便地管理專案中的多個 packages，這樣可以更好地隔離不同的功能，減少相依性的問題，並且可以簡化專案的結構，使其更易於維護和開發
  * vite-plugin-dts：是一個 Vite 插件，用於生成 TypeScript 宣告檔，方便其他 TypeScript 項目使用當前項目中的模組，如果引入你的组件项目是由TS构建的，但你却没有对项目打包自动生成文件声明，那么会出现组件引入的类型报错
  * @types/node：因為 vite 針對 typescript 設定有用到 node core 環境變數所以需要安裝 @types/node

```cmd
yarn create vite <library>  --template react-ts

yarn add --dev vite-plugin-dts -W

npm install --save-dev @types/node

npm i --save-dev @types/styled-components

npm install --save-dev vite-plugin-dts

// 確保 package.json xx-lib: file:路徑 ，才會是本地依賴

npm link my-react-components-library

yarn workspace @react-project/site add @react-project/lib@^0.0.0

npm install ../my-library
```

#### React Storybook 直接看官網的就簡單易懂了 ( 支援度最高的也是 React 還有中文 )

[Storybook 教學：React 篇](https://storybook.js.org/tutorials/intro-to-storybook/react/zh-TW/get-started/)

[在vite项目中使用storybook](https://zhuanlan.zhihu.com/p/387127953)

`yarn add --dev @storybook/builder-vite`

* storybook-builder-vite 與 @storybook/builder-vite 都是 Storybook 的 ViteJS 建構工具
  * 它們之間的差異在於：storybook-builder-vite 是由社群開發的第三方建構工具，而 @storybook/builder-vite 則是由 Storybook 團隊開發和維護的官方建構工具。storybook-builder-vite 提供了更多自定義選項，例如配置 ViteJS 插件、自定義 Webpack 設定等等。而 @storybook/builder-vite 則提供了更多的默認設定和預設值，可以更快速地啟動 Storybook。@storybook/builder-vite 已經包含在最新版本的 Storybook 中，因此無需額外安裝，而 storybook-builder-vite 則需要單獨安裝和配置。總體而言，如果您需要更多自定義選項並且願意進行額外的配置，那麼 storybook-builder-vite 可能更適合您。但如果您想要更快速地啟動 Storybook，並希望使用官方支援的建構工具，那麼 @storybook/builder-vite 可能更適合您
  * [Error: Cannot find module '@storybook/builder-storybook-builder-vite'](https://github.com/storybookjs/builder-vite/issues/4)
  * [Error message "error:0308010C:digital envelope routines::unsupported"](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported)
  * [Vite + Storybook 6.3 + Jest: "global is not defined"](https://github.com/storybookjs/storybook/issues/15391)
* workspace nomorepo 整合上與熱重載遇到許多問題，架構直接改為單一 repo 並利用 storybook 測試兼展示
  * ![aa](https://github.com/UrWebApp/ComponentLibrary/blob/master/img/2node.png)
* pnpm：[pnpm是一款當代備受關注的 新興 (問題較多) 包管理工具，使用過的同學們都會被它極快的安裝速度、極少的磁盤存儲空間所吸引
](https://www.readfog.com/a/1658320214914338816)
* Nx Template：也有支援 React 但問題好像也蠻多
  * [documents/generate](https://nx.dev/packages/nx/documents/generate)
  * [angular-standalone-tutorial](https://nx.dev/getting-started/angular-standalone-tutorial)
  * Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more
  * [storybookjs/storybookSupport React 18 #18331](https://github.com/storybookjs/storybook/issues/18331)
#### !!! Vite / Template React & TS  / Init Storybook !!! 建議直接使用以下人家整理好的 Repo

大型 [https://github.com/NiGhTTraX/ts-monorepo](https://github.com/NiGhTTraX/ts-monorepo)

較小 [https://github.com/adiun/vite-monorepo](https://github.com/adiun/vite-monorepo)

### Angular MonoRepo

1. tsconfig.json => path "projects/lib/*", "dist/lib/*" 
   * ng serve 開發模式優先從 projects/lib 目錄下尋找模組
   * ng build 解析器會優先從 dist/lib 目錄下尋找模組
2. `ng generate application <app-name>` 新增新站台
3. 新增 component 可以透過 gui 新增資料夾在在 application 專案後，在搬移至 library 專案 ( gui 套件結構問題，除非去改 generate schame )
4. 框架二次封裝高階元件比對網站 https://www.slant.co/、https://moiva.io/

#### 模組參考項目

1. 千人群聊專案 [影片](https://www.douyin.com/user/MS4wLjABAAAA0VPScPz6NfgTCKstkkGr5RS6tsAC8PgpVT7F_Rb2XwA?modal_id=7249728594157505849) [Github](https://github.com/Evansy/MallChatWeb)
2. [渡一Web前端学习频道](https://www.douyin.com/search/%E6%B8%A1%E4%B8%80?source=switch_tab&type=user) 所有渡一的都可以看一下，都是前端拆單元模組出來講
3. [前端面試考題](https://www.douyin.com/note/7234853856453070140)
4. [JS Design Pattern](https://ithelp.ithome.com.tw/users/20112280/ironman/2093?page=1)
5. 都做完再去 KGPT 找表單內類別試程式或商業的看有沒有機會有其他的可能性
6. [ng-lightning](https://github.com/ng-lightning/ng-lightning/tree/master/projects/ng-lightning/src)
7. [29 個 components](https://ithelp.ithome.com.tw/articles/10288482)
8. [100 個 components / js game](https://github.com/johch3n611u/johch3n611u/tree/main/Research/SelfTraing)
9. [擊破前端面試的困難 / 或許可以做成 comopnent demo ?](https://medium.com/@askiebaby/%E6%93%8A%E7%A0%B4%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%A9%A6%E7%9A%84%E5%9B%B0%E9%9B%A3-%E7%B9%81%E4%B8%AD%E7%BF%BB%E8%AD%AF-5054500e9415)
10. advergaming 感覺是趨勢? 還是可能過時了
11. [30js做成 components](https://github.com/wesbos/JavaScript30)
12. [w3c how to](https://www.w3schools.com/howto/default.asp)
13. [Angular 大師之路](https://ithelp.ithome.com.tw/users/20020617/ironman/1630)
14. [understanding-angular-overview](https://angular.tw/guide/understanding-angular-overview)
15. [ant design](https://ant.design/components/overview/)
16. [angular design pattern](https://blogs.halodoc.io/commonly-used-design-patterns-in-angular/)
17. [ng jest](https://ithelp.ithome.com.tw/articles/10308509)
18. [30 天擁有一套自己手刻的 React UI 元件庫](https://ithelp.ithome.com.tw/m/users/20111490/ironman/3999)
19. [以經典小遊戲為主題之ReactJS應用練習](https://ithelp.ithome.com.tw/m/users/20111490/ironman/2007)
20. [awesome-angular-components](https://github.com/brillout/awesome-angular-components)
21. [vueuse](https://vueuse.org/functions.html)
