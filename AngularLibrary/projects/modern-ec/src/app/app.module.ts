import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/page/home/home.component';
import { PageHeaderComponent } from './features/layout/page-header/page-header.component';
import { LibraryModule } from 'lib/library.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
