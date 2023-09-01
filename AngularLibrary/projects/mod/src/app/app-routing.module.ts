import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './sample/sample.component';
import { DynamicMasonryComponent } from './dynamic-masonry/dynamic-masonry.component';
import { RwdTableComponent } from './rwd-table/rwd-table.component';
import { MemoryCardsComponent } from './memory-cards/memory-cards.component';

const routes: Routes = [
  { path: '', component: MemoryCardsComponent },
  { path: 'sample', component: SampleComponent, pathMatch: 'full' },
  { path: 'dynamic-masonry', component: DynamicMasonryComponent, pathMatch: 'full' },
  { path: 'memory-cards', component: MemoryCardsComponent, pathMatch: 'full' },
  { path: 'rwd-table', component: RwdTableComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
