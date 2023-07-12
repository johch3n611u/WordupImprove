import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './components/sample/sample.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

const routes: Routes = [
  { path: 'sample', component: SampleComponent , pathMatch: 'full' },
  { path: '', component: HomepageComponent },
  // { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,{
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
