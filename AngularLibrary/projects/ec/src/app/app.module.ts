import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SampleModule } from "projects/lib/sample/sample.module";
import { LibraryModule } from "projects/lib/library.module";

@NgModule({
    declarations: [
        AppComponent     
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
