import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { CategoryComponent } from './pages/category/category.component';
import { EsgMarketingComponent } from './pages/landing-page/esg-marketing/esg-marketing.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'landingPage', component: EsgMarketingComponent },
  // { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {
    // enableTracing: true,
    scrollPositionRestoration: 'enabled',
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0],
  }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
