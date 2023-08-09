# 要點

1. 所有東西 ( gitBranch、filesArchitecture、communicate ) 都越扁平越好並保持 DRY 原則，能夠快速釐清、整合、決策、執行，避免延伸非必要的任何事情
2. 用新的 [pnpm](https://zhuanlan.zhihu.com/p/546400909) 進行模組管理，指令同 npm ( [NPM-vs-Yarm-vs-PNPM](https://www.atatus.com/blog/npm-vs-yarn-vs-pnpm/) )
3. [NG-ZORRO](https://ng.ant.design/docs/introduce/en) 參考較多人使用的 UI Repo 去產結構，以 feature 業務邏輯對原生 element 或第三方元件庫進行二次封裝
4. 新模組或元件 / 功能需先查詢此文檔有無類似功能並優化重構，如無則需補上說明文件與路徑
5. 框架二次封裝高階元件，庫流行度比對網站 https://www.slant.co/、https://moiva.io/
6. 找不到功能應用開發可以參考 [模組參考項目](https://github.com/UrWebApp/ComponentLibrary/tree/master#%E6%A8%A1%E7%B5%84%E5%8F%83%E8%80%83%E9%A0%85%E7%9B%AE)
7. 盡量補上測試或至少保留原生單元測試
   * unit `ng test` [Karma](https://karma-runner.github.io)
   * end-to-end `ng e2e` 端對端測試的套件最多人使用的是 Protractor
8. 用 [Markdown All in One: Create Table of Contents](https://zhuanlan.zhihu.com/p/126353341) 自動產生 github 目錄

## Angular MonoRepo 要點

1. 新增庫專案 `ng generate library <library> --prefix <library>` 
   * --prefix 會更改 app-xxx 為新前綴 library-xxx
2. 新增程式專案 `ng generate application <app-name>` 
3. tsconfig.json => path "projects/lib/*", "dist/lib/*" 
   * ng serve 開發模式優先從 projects/lib 目錄下尋找模組
   * ng build 解析器會優先從 dist/lib 目錄下尋找模組
4. 新增 component 可以透過 gui 新增資料夾在在 application 專案後，在搬移至 library 專案 
   * gui 套件結構問題，除非去改 generate schame

## 模組參考項目

<details>
  <summary>如果不確定開發題材可以從這找</summary>

1. [LargeEcProhectArchitecture 大型跨國 MonoRepo 架構](https://github.com/UrWebApp/ComponentLibrary/tree/master#large-ec-project-architecture)
1. 千人群聊專案 [影片](https://www.douyin.com/user/MS4wLjABAAAA0VPScPz6NfgTCKstkkGr5RS6tsAC8PgpVT7F_Rb2XwA?modal_id=7249728594157505849) [Github](https://github.com/Evansy/MallChatWeb)
2. [渡一Web前端学习频道](https://www.douyin.com/search/%E6%B8%A1%E4%B8%80?source=switch_tab&type=user) 所有渡一的都可以看一下，都是前端拆單元模組出來講
3. [前端面試考題](https://www.douyin.com/note/7234853856453070140)
4. [JS Design Pattern](https://ithelp.ithome.com.tw/users/20112280/ironman/2093?page=1)
5. 都做完再去 KGPT 找表單內類別試程式或商業的看有沒有機會有其他的可能性
6. [ng-lightning](https://github.com/ng-lightning/ng-lightning/tree/master/projects/ng-lightning/src)
7. [29 個 components](https://ithelp.ithome.com.tw/articles/10288482)
8. [100 個 components / js game](https://github.com/johch3n611u/johch3n611u/tree/main/Research/SelfTraing)
9. [擊破前端面試的困難 / 或許可以做成 comopnent demo ?](https://medium.com/@askiebaby/%E6%93%8A%E7%A0%B4%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%A9%A6%E7%9A%84%E5%9B%B0%E9%9B%A3-%E7%B9%81%E4%B8%AD%E7%BF%BB%E8%AD%AF-5054500e9415)
10. Advergaming 感覺是趨勢? 還是可能過時了
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
22. [今天我想來在 Angular 應用程式上加上測試保護 系列](https://ithelp.ithome.com.tw/users/20109645/ironman/5708)
23. [什麼？又是／不只是 Design Patterns!?](https://ithelp.ithome.com.tw/users/20120812/ironman/2697)
24. [全世界最大開放 api 項目](https://github.com/public-apis/public-apis)
25. [中文api](https://github.com/TonnyL/Awesome_APIs)

</details>

## 進程紀錄

### 1. [Survey Architecture](https://github.com/orgs/UrWebApp/projects/2?pane=issue&itemId=33942364)

我們需要一個能夠共用專案的解決方案，
其中包括能夠開發和展示元件、模組、頁面和站台，
以及能夠將它們嵌入到 Hexo 文章或新建的頁面中。

在進行調查後我們發現

1. 需要解決多專案過多類似的 Node 模組，與模組之間相互依賴的問題，一個常見的解決方案是使用 NPM WorkSpace，功能與 Yarn 類似，也有更進階的 pnpm 解決方案可以使用。
2. 需要解決模組展示站台的問題；我們找到了 Storybook 它提供了一個現有的介面，只需要編輯 stories 文件就可以顯示元件的敘述架構，並且可以在平台上進行單元測試。
3. 然而我們研究了 Storybook + React + Vite + TS 的架構後發現，這個架構並非完美的解決方案。由於它結合了新舊元素，存在著很多架構整合問題需要解決，而且也缺乏最新的相關資料支持。
4. 最後剛好手邊公司的專案有使用到 [大型 EC 專案 Angular 的 MonoRepo]()，並且有實務運行在多個國家不同站台的戰績，恰好符合我們的需求，只需補上展示平台即可，最終決定了這個方案。

[詳細內容可以參考此連結](https://github.com/UrWebApp/ComponentLibrary/blob/master/Doc/SurveyArchitecture.md)

<img align="left" src="https://github.com/UrWebApp/ComponentLibrary/assets/46659635/def0a640-eea8-4a5e-94c8-6fc291786c1c" width="50%">

### 2. [Angular MonoRepo](https://github.com/orgs/UrWebApp/projects/2?pane=issue&itemId=33943325)

它是 NG 6 後提供的設計模式，在以往通常多個專案就會有多個 Node 模組與多個資料夾，
利用 MonoRepo 可以將多個程式與庫放在同個倉庫中，共同管理代碼部屬、複用。

如果你寫過 C# 其實會更好理解，它就像 Visual Studio 內的方案與專案、類別庫的依賴與關係架構，較不一樣的是 VS 可以專注於資料面整合不同版本的專案、庫，但 NG MonoRepo 只能共享同個版本的專案與庫，目前解決方案是搭配 pnpm 使用。

接著我們也做了一些 在 [Hexo 中整合 Angular 的研究](https://urwebapp.github.io/Dev-Tech/HexoNestedAngular/)，最終生出以下架構

比較值得一提的是 Library，相較於一般的元件庫的共用元件，以特徵需求與一般 UI 作為分類方式，
這裡更多的可能是針對不同國家/單位的事業體 EC 所提供的 Service 搭配不同的 Pipe 所組合而成的商業邏輯資料，

而相較於整個站台的 Demo，其餘有價值的模組則會在 module 專案內。

[詳細內容可以參考此連結](https://github.com/UrWebApp/ComponentLibrary/blob/master/Doc/MonoRepo.md)

### 3. [Components SASS Global Variables and Media Query RWD, Theme Transformation](https://github.com/orgs/UrWebApp/projects/2?pane=issue&itemId=34428518)

CSS 中最大的幾個議題

1. 不好確定是否重複命名
2. 選擇器權重在專案過大時不好管控最後可能會束諸 !important
3. 切換頁面開發會增加心智負擔 ( 透過 CSS in JS 解決 )

[(Sass-vs-Tailwind-vs-Styled-components)Methodology-Comparison](https://ttt.studio/tech/sass-vs-tailwind-css-vs-styled-components-a-css-methodology-comparison/)

目前還是看好 SASS 解決方案，1、2 可以透過 Component Style 解決，CSS in JS 可以透過 Angular 的 Component Styles 搞定，所以最後決定嘗試導入 sass-resources-loader

<br><br><br><br>

## 架構與文檔

### Large EC Project Architecture

<details>
<summary>實戰過多國多站台共用元件庫架構</summary>

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
     > Events > Page Meta Event ( GTM )
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

```V2
Addon > OneTrust 隱私管理和合規平台
Auth  > Connectors
      > Guards
      > Http Interceptors
      > User Auth                   > Config
                                    > Facade
                                    > Services
      > Web Auth                    > Components
                                    > Models
                                    > Services
BaseStore > Connectors
          > Facade
          > Store                   > Actions
                                    > Effects
                                    > Reducers
                                    > Selectors
BeautyProfile
Brand > Core                        > Connectors
                                    > Facade
                                    > Store
Cart  > Adaptors
      > Components
      > Core                        > Connectors
                                    > Services
                                    > Store
Category > Connectors
         > Facades
         > Services
         > Store
         > Utils
Checkout > Core                     > Adaptors
                                    > Services
                                    > Store
Core     > Adapters 
         > Config
         > Events
         > Guards
         > Http Interceptors
         > i18n
         > Models
         > Pipes
         > Resolvers
         > Routing                  > Scroll Position Restoration
Services > Captcha
         > CMS
         > Common                   > Autocomplete
                                    > Breakpoint
                                    > BuildInfo
                                    > Criteo 開放互聯網的商業媒體平台
                                    > Device Detector
                                    ...
         > CRM
         > Search                   > Algolia
                                    > Google Speech
                                    > Google Vision
         > Utils
         > Window
Error Handling
Field Options
Form
Http
Lazada 國際電子商務公司
Multi Cart
Newsletter
OO Commerce     
Popup
Product 
Routes
Shared                              > Components > > CMS
                                                   > Common
                                                   > Misc
                                                   > Modal
                                                   > Simple Form Fields
                                    > Models
                                    > Root
                                    > Services 
                                    > Social Media
SSR
Store Finder                    
Supplier
User
Vop
========================================================
<Platform>
Modules
Page Layout / Slot Spartacus
Routing
Spartacus > Features
Assets    > API
          > CSS
          > ERROR PAGE
          > Font
          > Icons
          > Img
          > Lottie 是一種矢量圖形動畫文件格式
          > Mock
          > Robots
          > Scss
          > Translations
Components
Core      > Some Other
Environments
Form
Legacy
Manifests
Replacements
Scripts
Server
Service Worker
```

</details>

### [Lib] Loading Overlay Service

加載狀態的管理控制。它包含了被觀察的屬性和方法，根據不同的進程 ID 來跟踪和控制加載過程。
  
### [Lib] Queue Service

throttle(節流): 從最初一次觸發開始，在 t秒後執行函數。中間無論觸發多少次都不會執行。

debounce(防抖): 從最後一次觸發開始，在 t秒後執行函數。因為是最後一次觸發，所以會把中間的觸發蓋掉。

### [Lib] FakeData Service

Facade 門面模式 Rxjs combineLatest 組合不同取得資料的 API　統一使用的介面

[單元測試名詞解釋](https://medium.com/starbugs/unit-test-%E4%B8%AD%E7%9A%84%E6%9B%BF%E8%BA%AB-%E6%90%9E%E4%B8%8D%E6%B8%85%E6%A5%9A%E7%9A%84dummy-stub-spy-mock-fake-94be192d5c46) DummyObject、TestStub、TestSpy、MockObject、FakeObject

### [Lib] Translate Service

透過 Json / Angular Token 製作簡易版本的翻譯 i18n 功能，透過 pipe 與 module 內注入的 Json 檔案，讓所有站台都可以複用

### [EC-Panel] Mega Menu 動態模板套版

ngTemplateOutlet、ng-container、ng-template 透過以上選擇器特性與流程控制 ngIf、ngFor else 完成動態套版

[可參考 Angular 大師之路：淺出深入的學習筆記](https://urwebapp.github.io/Dev-Tech/PathAgMasterGuideLearningBasicsAdvanced/#day12-ngTemplateOutlet)

### [EC-CheckAndBuyPage] Router 同頁重載

思路：爬文後對於金流前置業面 ( 背包 => 查看 => 交易資訊填寫 => 付款 => 感謝 ) 似乎可以在同個元件中完成避免資料流傳來傳去，但如果在同頁刷新必須回到查看頁。

[Angular刷新当前页面的几种方法](https://blog.csdn.net/xuehu837769474/article/details/104763685)
