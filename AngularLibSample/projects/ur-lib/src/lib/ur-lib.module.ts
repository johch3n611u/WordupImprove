import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from './components/alert/alert.module';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    AlertModule
  ]
})
export class UrLibModule { }
