import { CUSTOM_ELEMENTS_SCHEMA, EnvironmentProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

import { WrapperComponent } from './user-interface/wrapper/wrapper.component';
import { BreadcrumbsComponent } from './user-interface/breadcrumbs/breadcrumbs.component';
import { CarouselComponent } from './user-interface/carousel/carousel.component';
import { FakeDataService } from './feature/fake-data/fake-data.service';
import { ToThousandPipe } from './feature/to-thousand/to-thousand.pipe';
import { TranslatePipe } from './feature/translate/translate.pipe';

let components = [
  WrapperComponent,
  BreadcrumbsComponent,
  CarouselComponent,
];

let pipes = [
  ToThousandPipe,
  TranslatePipe,
];

// providers 內宣告 Service 只能注入到 libraryModule 所屬元件，如要在其他站台，須直接 import service 不能透過 Module
// https://stackoverflow.com/questions/54146947/how-to-consume-a-service-from-angular-library-in-a-project
let providers = [
  FakeDataService
];

@NgModule({
  providers: providers,
  declarations: [...components, ...pipes],
  imports: [
    CommonModule,
  ],
  exports: [...components, ...pipes],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibraryModule { }
