import { superMenuModal } from './../../layout/page-header/superMenuModal';
import { Component } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menuList:superMenuModal[] = [{
    name: "Super Menu",
    categories: [
      {
        name: "Tops",
        products: [
          {
            name: "Striped T-Shirt",
            imgUrl: "https://example.com/images/stripe_tshirt.jpg"
          },
          {
            name: "Button-up Shirt",
            imgUrl: "https://example.com/images/button_up_shirt.jpg"
          },
          {
            name: "Sweater",
            imgUrl: "https://example.com/images/sweater.jpg"
          }
        ]
      },
      {
        name: "Bottoms",
        products: [
          {
            name: "Jeans",
            imgUrl: "https://example.com/images/jeans.jpg"
          },
          {
            name: "Chinos",
            imgUrl: "https://example.com/images/chinos.jpg"
          },
          {
            name: "Skirt",
            imgUrl: "https://example.com/images/skirt.jpg"
          }
        ]
      },
      {
        name: "Dresses",
        products: [
          {
            name: "Summer Dress",
            imgUrl: "https://example.com/images/summer_dress.jpg"
          },
          {
            name: "Evening Gown",
            imgUrl: "https://example.com/images/evening_gown.jpg"
          },
          {
            name: "Casual Dress",
            imgUrl: "https://example.com/images/casual_dress.jpg"
          }
        ]
      }
    ]
  }];
}
