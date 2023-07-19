import { Component, Input } from '@angular/core';

@Component({
  selector: 'ec-marketing-products[marketingName]',
  templateUrl: './marketing-products.component.html',
  styleUrls: ['./marketing-products.component.scss']
})
export class MarketingProductsComponent {
  @Input('marketingName') marketingName: string | undefined;
  @Input('displayMode') displayMode: string | undefined = 'sidebar';

  products = [
    {

    },{

    },{

    },{

    },{

    },{

    },{
      
    }
  ];

  ngOnInit(): void {
    console.log(this.marketingName);
  }
}
