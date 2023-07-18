import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './components/sample/sample.component';
import { DynamicMasonryComponent } from './layout/dynamic-masonry/dynamic-masonry.component';

const routes: Routes = [
  { path: '', component: DynamicMasonryComponent },
  { path: 'sample', component: SampleComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
