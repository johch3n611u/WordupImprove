import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ec-check-and-buy-page',
  templateUrl: './check-and-buy-page.component.html',
  styleUrls: ['./check-and-buy-page.component.scss']
})
export class CheckAndBuyPageComponent {
  promotional = [{}, {}];
  products = [{}, {}, {}];
  template: any;
}
