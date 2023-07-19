import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { EsgMarketingPageComponent } from './pages/landing-page/esg-marketing-page/esg-marketing-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CheckAndBuyPageComponent } from './pages/check-and-buy-page/check-and-buy-page.component';

const routes: Routes = [
  { path: '', component: ProductPageComponent },
  { path: 'account', component: AccountPageComponent },
  { path: 'category', component: CategoryPageComponent },
  { path: 'checkAndBuy', component: CheckAndBuyPageComponent },
  { path: 'product', component: ProductPageComponent },
  { path: 'landing/esgMarketing', component: EsgMarketingPageComponent },
  // { path: '', component: HomeComponent },
  { path: '**', component: NotFoundPageComponent }
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
