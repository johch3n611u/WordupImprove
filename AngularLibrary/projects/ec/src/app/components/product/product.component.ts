import { Component, Input } from '@angular/core';

@Component({
  selector: 'ec-product[product]',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input('product') product: any = {};
}
