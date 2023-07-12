import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SampleModule } from "lib/components/sample/sample.module";
import { LibraryModule } from "projects/lib/library.module";
import { SampleComponent } from './components/sample/sample.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

@NgModule({
    declarations: [
        AppComponent,
        SampleComponent,
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
