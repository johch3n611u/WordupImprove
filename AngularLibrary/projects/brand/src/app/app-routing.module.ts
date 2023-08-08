import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HowItWorksPageComponent } from './pages/how-it-works-page/how-it-works-page.component';
import { OurServicesPageComponent } from './pages/our-services-page/our-services-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'aboutUs', component: AboutUsPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'howItWorks', component: HowItWorksPageComponent },
  { path: 'ourServices', component: OurServicesPageComponent },
  { path: '', component: HomePageComponent },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
