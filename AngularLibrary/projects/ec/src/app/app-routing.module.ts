import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { EsgMarketingPageComponent } from './pages/landing-page/esg-marketing-page/esg-marketing-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CheckAndBuyPageComponent } from './pages/check-and-buy-page/check-and-buy-page.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PortalPageComponent } from './pages/portal-page/portal-page.component';

const routes: Routes = [
  {
    path: 'account', component: AccountPageComponent,
    children: [
      { path: 'information', component: AccountInformationComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'privacy&policy', component: PrivacyPolicyComponent },
    ]
  },
  { path: 'category', component: CategoryPageComponent },
  { path: 'checkAndBuy', component: CheckAndBuyPageComponent },
  { path: 'category/product', component: ProductPageComponent },
  { path: 'portal', component: PortalPageComponent },
  { path: 'landing/esgMarketing', component: EsgMarketingPageComponent },
  { path: '', component: PortalPageComponent },
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
