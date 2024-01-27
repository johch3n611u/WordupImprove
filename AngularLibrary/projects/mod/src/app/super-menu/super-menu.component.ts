import { Component } from '@angular/core';
import { superMenuModal } from './super-menu.modal';

@Component({
  selector: 'mod-super-menu',
  templateUrl: './super-menu.component.html',
  styleUrls: ['./super-menu.component.scss']
})
export class SuperMenuComponent {
  upSearch(event:any):void{
    this.SearchingStyle.active = false;
  }
  onSearch(event: any):void{
    this.SearchingStyle.active = true;
  };
  SearchingStyle={
    'active':false
  }

  headerLv2Hover(event:any){
    console.log(event);
  }
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
