import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { EsgMarketingComponent } from './pages/landing/esg-marketing/esg-marketing.component';
import { ProductComponent } from './pages/product/product.component';
import { AccountComponent } from './pages/account/account.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckAndBuyComponent } from './pages/check-and-buy/check-and-buy.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'account', component: AccountComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'checkAndBuy', component: CheckAndBuyComponent },
  { path: 'product', component: ProductComponent },
  { path: 'landing/esgMarketing', component: EsgMarketingComponent },
  // { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
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
