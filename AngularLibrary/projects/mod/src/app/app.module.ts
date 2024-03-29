import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';

import { SuperMenuComponent } from './super-menu/super-menu.component';

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
import { PalWorldMapLeafletComponent } from './pal-world-map-leaflet/pal-world-map-leaflet.component';
import { HomeComponent } from './home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';

// https://stackoverflow.com/questions/60726180/angular-9-value-at-position-x-in-the-ngmodule-imports-is-not-a-reference  reload  vscode
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SampleComponent,
    DynamicMasonryComponent,
    RwdTableComponent,
    MemoryCardsComponent,
    SuperMenuComponent,
    WordupImproveComponent,
    PalWorldMapLeafletComponent
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
    HighlightPipeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      // 詳細請看此次 commit 可以看到新增了哪些東西與設定, 目前 ng-sw 還存在蠻多問題，將就用
      // https://github.com/angular/angular/issues/47455
      // chrome dev tool -> Application -> Storage -> clear site data -> after you have disabled the service worker via ServiceWorkerModule's enabled property. that's the most effective way i've found to have the SW removed.
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
      // you already set this config
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
