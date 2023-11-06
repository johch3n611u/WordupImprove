import { SuperMenuComponent } from './super-menu/super-menu.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryModule, SampleModule } from 'lib/public-api';
import { SampleComponent } from './sample/sample.component';
import { DynamicMasonryComponent } from './dynamic-masonry/dynamic-masonry.component';
import { RwdTableComponent } from './rwd-table/rwd-table.component';
import { MemoryCardsComponent } from './memory-cards/memory-cards.component';
import { WordupImproveComponent } from './wordup-improve/wordup-improve.component';
import { FormsModule } from '@angular/forms';
import { HighlightPipeModule } from "../../../lib/feature/highlight/highlight.module";

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


@NgModule({
  declarations: [
    AppComponent,
    SampleComponent,
    DynamicMasonryComponent,
    RwdTableComponent,
    MemoryCardsComponent,
    SuperMenuComponent,
    WordupImproveComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    FormsModule,
    SampleModule,
    LibraryModule,
    HighlightPipeModule
  ]
})
export class AppModule { }
