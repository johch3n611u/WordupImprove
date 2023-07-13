import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule } from 'lib/public-api';
import { HomepageComponent } from './pages/homepage/homepage.component';
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
];

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        ...components
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SampleModule,
        LibraryModule
    ]
})
export class AppModule { }
