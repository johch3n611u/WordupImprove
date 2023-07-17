import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule } from 'lib/public-api';
import { SampleComponent } from './components/sample/sample.component';
import { DynamicMasonryComponent } from './layout/dynamic-masonry/dynamic-masonry.component';


@NgModule({
  declarations: [
    AppComponent,
    SampleComponent,
    DynamicMasonryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SampleModule,
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
