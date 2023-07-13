import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule } from 'lib/public-api';
import { HomepageComponent } from './pages/homepage/homepage.component';

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SampleModule,
        LibraryModule
    ]
})
export class AppModule { }
