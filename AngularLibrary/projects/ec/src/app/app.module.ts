import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule } from 'lib/public-api';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CallToActionAtTopComponent } from './components/call-to-action-at-top/call-to-action-at-top.component';
import { PanelComponent } from './components/panel/panel.component';
import { HeaderBoardComponent } from './components/header-board/header-board.component';
import { MegaMenuTabsComponent } from './components/mega-menu-tabs/mega-menu-tabs.component';
import { CoreThemesComponent } from './components/core-themes/core-themes.component';
import { CopyRightComponent } from './components/copy-right/copy-right.component';
import { FooterNavComponent } from './components/footer-nav/footer-nav.component';
import { MarketingPanelComponent } from './components/marketing-panel/marketing-panel.component';
import { CategoriesCarouselComponent } from './components/categories-carousel/categories-carousel.component';
import { AwardsCarouselComponent } from './components/awards-carousel/awards-carousel.component';
import { InstagramCarouselComponent } from './components/instagram-carousel/instagram-carousel.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { MarketingArticlesComponent } from './components/marketing-articles/marketing-articles.component';
import { MarketingViedoComponent } from './components/marketing-viedo/marketing-viedo.component';
import { HeroImagesComponent } from './components/hero-images/hero-images.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { CategoryBannerComponent } from './components/category-banner/category-banner.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryDescriptionComponent } from './components/category-description/category-description.component';
import { PostersFlyersComponent } from './components/posters-flyers/posters-flyers.component';
import { EsgMarketingPageComponent } from './pages/landing-page/esg-marketing-page/esg-marketing-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AddToBagComponent } from './components/add-to-bag/add-to-bag.component';
import { CheckAndBuyPageComponent } from './pages/check-and-buy-page/check-and-buy-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { MarketingProductsComponent } from './components/marketing-products/marketing-products.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { PortalPageComponent } from './pages/portal-page/portal-page.component';
import { ProductComponent } from './components/product/product.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { OrdersComponent } from './components/orders/orders.component';
import { EsgMarketingBannerComponent } from './components/esg-marketing-page/banner/esg-marketing-banner.component';

let components = [
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
  MarketingViedoComponent,
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

@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ...pages,
    AccountInformationComponent,
    PrivacyPolicyComponent,
    OrdersComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SampleModule,
    LibraryModule,
  ]
})
export class AppModule { }
