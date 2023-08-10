import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './blocks/header/header.component';
import { FooterComponent } from './blocks/footer/footer.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HowItWorksPageComponent } from './pages/how-it-works-page/how-it-works-page.component';
import { OurServicesPageComponent } from './pages/our-services-page/our-services-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { FakeCreditCardVerificationPageComponent } from './pages/fake-credit-card-verification-page/fake-credit-card-verification-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsPageComponent,
    HomePageComponent,
    HowItWorksPageComponent,
    OurServicesPageComponent,
    NotFoundPageComponent,
    FakeCreditCardVerificationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
