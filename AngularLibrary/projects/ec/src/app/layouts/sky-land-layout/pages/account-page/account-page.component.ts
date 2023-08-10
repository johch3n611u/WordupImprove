import { Component } from '@angular/core';

@Component({
  selector: 'ec-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent {

  activeBlock = 0;

  blocks = [
    { name: 'AccountInformation', url: 'information' },
    { name: 'Orders', url: 'orders' },
    { name: 'Discount & Coupon', url: 'orders' },
    { name: 'Privacy & Policy', url: 'privacy&policy' },
    { name: 'Frequently Asked Questions', url: 'privacy&policy' },
    { name: 'Contact Us', url: 'information' }
  ];
}
