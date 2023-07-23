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