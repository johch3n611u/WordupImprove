import { Component } from '@angular/core';
import { DeviceCheckService } from 'lib/public-api';

@Component({
  selector: 'ec-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent {
  constructor(
    public deviceCheckService: DeviceCheckService,
  ){
    
  }
}
