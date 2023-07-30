import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule, TranslateService } from 'lib/public-api';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CallToActionAtTopComponent } from './blocks/header/call-to-action-at-top/call-to-action-at-top.component';
import { PanelComponent } from './blocks/header/panel/panel.component';
import { HeaderBoardComponent } from './blocks/header/header-board/header-board.component';
import { MegaMenuTabsComponent } from './blocks/header/mega-menu-tabs/mega-menu-tabs.component';
import { CoreThemesComponent } from './blocks/footer/core-themes/core-themes.component';
import { CopyRightComponent } from './blocks/footer/copy-right/copy-right.component';
import { FooterNavComponent } from './blocks/footer/footer-nav/footer-nav.component';
import { MarketingPanelComponent } from './blocks/footer/marketing-panel/marketing-panel.component';
import { CategoriesCarouselComponent } from './pages/home-page/blocks/categories-carousel/categories-carousel.component';
import { AwardsCarouselComponent } from './pages/home-page/blocks/awards-carousel/awards-carousel.component';
import { InstagramCarouselComponent } from './pages/home-page/blocks/instagram-carousel/instagram-carousel.component';
import { BenefitsComponent } from './pages/home-page/blocks/benefits/benefits.component';
import { MarketingArticlesComponent } from './pages/home-page/blocks/marketing-articles/marketing-articles.component';
import { MarketingVideoComponent } from './pages/home-page/blocks/marketing-video/marketing-video.component';
import { HeroImagesComponent } from './pages/home-page/blocks/hero-images/hero-images.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { CategoryBannerComponent } from './pages/category-page/blocks/category-banner/category-banner.component';
import { CategoryListComponent } from './pages/category-page/blocks/category-list/category-list.component';
import { ProductListComponent } from './pages/category-page/blocks/product-list/product-list.component';
import { CategoryDescriptionComponent } from './pages/category-page/blocks/category-description/category-description.component';
import { PostersFlyersComponent } from './pages/category-page/blocks/posters-flyers/posters-flyers.component';
import { EsgMarketingPageComponent } from './pages/landing-page/esg-marketing-page/esg-marketing-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductDetailsComponent } from './pages/product-page/blocks/product-details/product-details.component';
import { AddToBagComponent } from './pages/product-page/blocks/add-to-bag/add-to-bag.component';
import { CheckAndBuyPageComponent } from './pages/check-and-buy-page/check-and-buy-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { MarketingProductsComponent } from './pages/product-page/blocks/marketing-products/marketing-products.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PortalPageComponent } from './pages/portal-page/portal-page.component';
import { ProductComponent } from './pages/product-page/blocks/product/product.component';
import { AccountInformationComponent } from './pages/account-page/blocks/account-information/account-information.component';
import { PrivacyPolicyComponent } from './pages/account-page/blocks/privacy-policy/privacy-policy.component';
import { OrdersComponent } from './pages/account-page/blocks/orders/orders.component';
import { EsgMarketingBannerComponent } from './pages/landing-page/esg-marketing-page/blocks/esg-marketing-banner/esg-marketing-banner.component';
import { TRANSLATION_PROVIDERS, TranSetting } from 'lib/feature/translate/translate';
import { TranslatePipe } from 'lib/feature/translate/translate.pipe';
import { LANG_TW_NAME, LANG_TW_TRANS } from '../assets/i18n/lazg-tw';
import { LANG_CN_NAME, LANG_CN_TRANS } from '../assets/i18n/lazg-cn';
import { LANG_THAI_NAME, LANG_THAI_TRANS } from '../assets/i18n/lazg-thai';
import { LANG_JAPANESE_NAME, LANG_JAPANESE_TRANS } from '../assets/i18n/lazg-japanese';

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

let pages = [
  AccountPageComponent,
  CategoryPageComponent,
  CheckAndBuyPageComponent,
  HomePageComponent,
  NotFoundPageComponent,
  ProductPageComponent,
  EsgMarketingPageComponent,
  PortalPageComponent,
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
  ],
  providers: [
    TRANSLATION_PROVIDERS(tranSetting),
    TranslateService,
    TranslatePipe,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SampleModule,
    LibraryModule,
  ]
})
export class AppModule { }
