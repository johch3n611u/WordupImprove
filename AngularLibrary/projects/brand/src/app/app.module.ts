import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HowItWorksPageComponent } from './pages/how-it-works-page/how-it-works-page.component';
import { OurServicesPageComponent } from './pages/our-services-page/our-services-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { LibraryModule } from 'lib/public-api';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AboutUsPageComponent,
    HomePageComponent,
    HowItWorksPageComponent,
    OurServicesPageComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LibraryModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
