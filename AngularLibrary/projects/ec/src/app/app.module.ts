import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule } from 'lib/public-api';
import { HomeComponent } from './pages/home/home.component';
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
import { CategoryComponent } from './pages/category/category.component';
import { CategoryBannerComponent } from './components/category-banner/category-banner.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryDescriptionComponent } from './components/category-description/category-description.component';
import { PostersFlyersComponent } from './components/posters-flyers/posters-flyers.component';
import { EsgMarketingComponent } from './pages/landing/esg-marketing/esg-marketing.component';
import { BannerComponent } from './components/marketing-esg/banner/banner.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AddToBagComponent } from './components/add-to-bag/add-to-bag.component';
import { CheckAndBuyComponent } from './pages/check-and-buy/check-and-buy.component';
import { AccountComponent } from './pages/account/account.component';
import { MarketingProductsComponent } from './components/marketing-products/marketing-products.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PortalComponent } from './pages/portal/portal.component';

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
  EsgMarketingComponent,
  BannerComponent,
  ProductDetailsComponent,
  AddToBagComponent,
];

let pages = [
  AccountComponent,
  CategoryComponent,
  CheckAndBuyComponent,
  HomeComponent,
  NotFoundComponent,
  ProductComponent,
  MarketingProductsComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ...pages,
    PortalComponent,
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
