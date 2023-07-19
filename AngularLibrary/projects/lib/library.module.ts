import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrapperComponent } from './components/wrapper/wrapper.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { CarouselComponent } from './components/carousel/carousel.component';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

let components = [
  WrapperComponent,
  BreadcrumbsComponent,
  CarouselComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
  ],
  exports: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibraryModule { }
