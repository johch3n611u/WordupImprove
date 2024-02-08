import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// https://stackoverflow.com/questions/44067002/how-to-clean-up-import-statements-in-modules
// todo：有機會的話抽成 module 或單頁 import export typescript
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule, TranslateService } from 'lib/public-api';
import { HomePageComponent } from './layouts/sky-land-layout/pages/home-page/home-page.component';
import { CallToActionAtTopComponent } from './layouts/sky-land-layout/blocks/header/call-to-action-at-top/call-to-action-at-top.component';
import { PanelComponent } from './layouts/sky-land-layout/blocks/header/panel/panel.component';
import { HeaderBoardComponent } from './layouts/sky-land-layout/blocks/header/header-board/header-board.component';
import { MegaMenuTabsComponent } from './layouts/sky-land-layout/blocks/header/mega-menu-tabs/mega-menu-tabs.component';
import { CoreThemesComponent } from './layouts/sky-land-layout/blocks/footer/core-themes/core-themes.component';
import { CopyRightComponent } from './layouts/sky-land-layout/blocks/footer/copy-right/copy-right.component';
import { FooterNavComponent } from './layouts/sky-land-layout/blocks/footer/footer-nav/footer-nav.component';
import { MarketingPanelComponent } from './layouts/sky-land-layout/blocks/footer/marketing-panel/marketing-panel.component';
import { CategoriesCarouselComponent } from './layouts/sky-land-layout/pages/home-page/blocks/categories-carousel/categories-carousel.component';
import { AwardsCarouselComponent } from './layouts/sky-land-layout/pages/home-page/blocks/awards-carousel/awards-carousel.component';
import { InstagramCarouselComponent } from './layouts/sky-land-layout/pages/home-page/blocks/instagram-carousel/instagram-carousel.component';
import { BenefitsComponent } from './layouts/sky-land-layout/pages/home-page/blocks/benefits/benefits.component';
import { MarketingArticlesComponent } from './layouts/sky-land-layout/pages/home-page/blocks/marketing-articles/marketing-articles.component';
import { MarketingVideoComponent } from './layouts/sky-land-layout/pages/home-page/blocks/marketing-video/marketing-video.component';
import { HeroImagesComponent } from './layouts/sky-land-layout/pages/home-page/blocks/hero-images/hero-images.component';
import { CategoryPageComponent } from './layouts/sky-land-layout/pages/category-page/category-page.component';
import { CategoryBannerComponent } from './layouts/sky-land-layout/pages/category-page/blocks/category-banner/category-banner.component';
import { CategoryListComponent } from './layouts/sky-land-layout/pages/category-page/blocks/category-list/category-list.component';
import { ProductListComponent } from './layouts/sky-land-layout/pages/category-page/blocks/product-list/product-list.component';
import { CategoryDescriptionComponent } from './layouts/sky-land-layout/pages/category-page/blocks/category-description/category-description.component';
import { PostersFlyersComponent } from './layouts/sky-land-layout/pages/category-page/blocks/posters-flyers/posters-flyers.component';
import { EsgMarketingPageComponent } from './layouts/sky-land-layout/pages/landing-page/esg-marketing-page/esg-marketing-page.component';
import { ProductPageComponent } from './layouts/sky-land-layout/pages/product-page/product-page.component';
import { ProductDetailsComponent } from './layouts/sky-land-layout/pages/product-page/blocks/product-details/product-details.component';
import { AddToBagComponent } from './layouts/sky-land-layout/pages/product-page/blocks/add-to-bag/add-to-bag.component';
import { CheckAndBuyPageComponent } from './layouts/sky-land-layout/pages/check-and-buy-page/check-and-buy-page.component';
import { AccountPageComponent } from './layouts/sky-land-layout/pages/account-page/account-page.component';
import { MarketingProductsComponent } from './layouts/sky-land-layout/pages/product-page/blocks/marketing-products/marketing-products.component';
import { NotFoundPageComponent } from './layouts/sky-land-layout/pages/not-found-page/not-found-page.component';
import { PortalPageComponent } from './layouts/sky-land-layout/pages/portal-page/portal-page.component';
import { ProductComponent } from './layouts/sky-land-layout/pages/product-page/blocks/product/product.component';
import { AccountInformationComponent } from './layouts/sky-land-layout/pages/account-page/blocks/account-information/account-information.component';
import { PrivacyPolicyComponent } from './layouts/sky-land-layout/pages/account-page/blocks/privacy-policy/privacy-policy.component';
import { OrdersComponent } from './layouts/sky-land-layout/pages/account-page/blocks/orders/orders.component';
import { EsgMarketingBannerComponent } from './layouts/sky-land-layout/pages/landing-page/esg-marketing-page/blocks/esg-marketing-banner/esg-marketing-banner.component';
import { TRANSLATION_PROVIDERS, TranSetting } from 'lib/feature/translate/translate';
import { TranslatePipe } from 'lib/feature/translate/translate.pipe';
import { LANG_TW_NAME, LANG_TW_TRANS } from '../assets/mods/i18n/lazg-tw';
import { LANG_CN_NAME, LANG_CN_TRANS } from '../assets/mods/i18n/lazg-cn';
import { LANG_THAI_NAME, LANG_THAI_TRANS } from '../assets/mods/i18n/lazg-thai';
import { LANG_JAPANESE_NAME, LANG_JAPANESE_TRANS } from '../assets/mods/i18n/lazg-japanese';
import { SingleColumnLayoutComponent } from './layouts/single-column-layout/single-column-layout.component';
import { SkyLandLayoutComponent } from './layouts/sky-land-layout/sky-land-layout.component';
import { FakeCreditCardVerificationPageComponent } from './layouts/single-column-layout/pages/fake-credit-card-verification-page/fake-credit-card-verification-page.component';
import { ThanksPageComponent } from './layouts/sky-land-layout/pages/thanks-page/thanks-page.component';


let layouts = [
  SingleColumnLayoutComponent,
  SkyLandLayoutComponent
];

let pages = [
  AccountPageComponent,
  CategoryPageComponent,
  CheckAndBuyPageComponent,
  HomePageComponent,
  NotFoundPageComponent,
  ProductPageComponent,
  EsgMarketingPageComponent,
  PortalPageComponent,
  ThanksPageComponent,
  FakeCreditCardVerificationPageComponent
];

let blocks = [
  CallToActionAtTopComponent,
  PanelComponent,
  HeaderBoardComponent,
  MegaMenuTabsComponent,
  CoreThemesComponent,
  CopyRightComponent,
  FooterNavComponent,
  MarketingPanelComponent,
  CategoriesCarouselComponent,
  AwardsCarouselComponent,
  InstagramCarouselComponent,
  BenefitsComponent,
  MarketingArticlesComponent,
  MarketingVideoComponent,
  HeroImagesComponent,
  CategoryBannerComponent,
  CategoryListComponent,
  ProductListComponent,
  CategoryDescriptionComponent,
  PostersFlyersComponent,
  EsgMarketingBannerComponent,
  ProductDetailsComponent,
  AddToBagComponent,
  MarketingProductsComponent,
  ProductComponent,
  AccountInformationComponent,
  PrivacyPolicyComponent,
  OrdersComponent,
];



const tranSetting: TranSetting = {
  [LANG_TW_NAME]: LANG_TW_TRANS,
  [LANG_CN_NAME]: LANG_CN_TRANS,
  [LANG_THAI_NAME]: LANG_THAI_TRANS,
  [LANG_JAPANESE_NAME]: LANG_JAPANESE_TRANS,
};

@NgModule({
  declarations: [
    AppComponent,
    ...blocks,
    ...pages,
    ...layouts,
  ],
  providers: [
    TRANSLATION_PROVIDERS(tranSetting),
    TranslateService,
    TranslatePipe,
  ],
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SampleModule,
    LibraryModule,
  ]
})
export class AppModule { }
