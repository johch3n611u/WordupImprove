import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrapperComponent } from './components/wrapper/wrapper.component';


let components = [
  WrapperComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
  ],
  exports: components
})
export class LibraryModule { }
