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

let components = [
  WrapperComponent,
  BreadcrumbsComponent,
  CarouselComponent,
];

let pipes = [
  ToThousandPipe
];

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
