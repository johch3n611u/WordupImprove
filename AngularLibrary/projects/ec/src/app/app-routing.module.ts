import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './layouts/sky-land-layout/pages/home-page/home-page.component';
import { CategoryPageComponent } from './layouts/sky-land-layout/pages/category-page/category-page.component';
import { EsgMarketingPageComponent } from './layouts/sky-land-layout/pages/landing-page/esg-marketing-page/esg-marketing-page.component';
import { ProductPageComponent } from './layouts/sky-land-layout/pages/product-page/product-page.component';
import { AccountPageComponent } from './layouts/sky-land-layout/pages/account-page/account-page.component';
import { NotFoundPageComponent } from './layouts/sky-land-layout/pages/not-found-page/not-found-page.component';
import { CheckAndBuyPageComponent } from './layouts/sky-land-layout/pages/check-and-buy-page/check-and-buy-page.component';
import { OrdersComponent } from './layouts/sky-land-layout/pages/account-page/blocks/orders/orders.component';
import { AccountInformationComponent } from './layouts/sky-land-layout/pages/account-page/blocks/account-information/account-information.component';
import { PrivacyPolicyComponent } from './layouts/sky-land-layout/pages/account-page/blocks/privacy-policy/privacy-policy.component';
import { PortalPageComponent } from './layouts/sky-land-layout/pages/portal-page/portal-page.component';
import { SkyLandLayoutComponent } from './layouts/sky-land-layout/sky-land-layout.component';
import { SingleColumnLayoutComponent } from './layouts/single-column-layout/single-column-layout.component';
import { FakeCreditCardVerificationPageComponent } from './layouts/single-column-layout/pages/fake-credit-card-verification-page/fake-credit-card-verification-page.component';
import { ThanksPageComponent } from './layouts/sky-land-layout/pages/thanks-page/thanks-page.component';

// todo：根據資料夾的動態路由
// tip 路由先後順序會影響網址匹配
const routes: Routes = [
  {
    path: 'sigleColumn', component: SingleColumnLayoutComponent,
    children: [
      { path: 'fakeCreditCardVerification', component: FakeCreditCardVerificationPageComponent },
      { path: '', component: FakeCreditCardVerificationPageComponent, },
      { path: '**', component: NotFoundPageComponent }
    ],
  },
  {
    path: '', component: SkyLandLayoutComponent,
    children: [
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
      { path: 'thanks', component: ThanksPageComponent },
      { path: 'landing/esgMarketing', component: EsgMarketingPageComponent },
      { path: '', component: HomePageComponent, },
      { path: '**', component: NotFoundPageComponent }
    ]
  },
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
