import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrapperComponent } from './components/wrapper/wrapper.component';
import { CallToActionAtTopComponent } from './components/call-to-action-at-top';
import { PanelComponent } from './components/panel/panel.component';
import { HeaderBoardComponent } from './components/header-board/header-board.component';
import { MegaMenuTabsComponent } from './components/mega-menu-tabs/mega-menu-tabs.component';
import { HeroImagesComponent } from './components/hero-images/hero-images.component';
import { CoreThemesComponent } from './components/core-themes/core-themes.component';
import { CopyRightComponent } from './components/copy-right/copy-right.component';
import { FooterNavComponent } from './components/footer-nav/footer-nav.component';
import { MarketingPanelComponent } from './components/marketing-panel/marketing-panel.component';

@NgModule({
  declarations: [
    WrapperComponent,
    CallToActionAtTopComponent,
    PanelComponent,
    HeaderBoardComponent,
    MegaMenuTabsComponent,
    HeroImagesComponent,
    CoreThemesComponent,
    CopyRightComponent,
    FooterNavComponent,
    MarketingPanelComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    WrapperComponent,
    CallToActionAtTopComponent,
    PanelComponent,
    HeaderBoardComponent,
    MegaMenuTabsComponent,
    CoreThemesComponent,
    CopyRightComponent,
    FooterNavComponent,
    MarketingPanelComponent,
  ]
})
export class LibraryModule { }
