import { Component } from '@angular/core';

@Component({
  selector: 'ec-fake-credit-card-verification-page',
  templateUrl: './fake-credit-card-verification-page.component.html',
  styleUrls: ['./fake-credit-card-verification-page.component.scss']
})
export class FakeCreditCardVerificationPageComponent {

  expirationMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  expirationYears = ['2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034'];

  creditCart = {
    cardNumber: ['', '', '', ''],
    cardHolder: '',
    expirationMonth: '',
    expirationYear: '',
    ccv: ''
  };

  creditFront: any;
  creditBack: any;

  ngDoCheck() {
  }

  editCCV() {
    this.creditFront = 'rotateY(180deg)';
    this.creditBack = 'rotateY(0deg)';
  }

  rotateCredit() {
    if (this.creditFront != 'rotateY(180deg)') {
      this.creditFront = 'rotateY(180deg)';
      this.creditBack = 'rotateY(0deg)';
    } else {
      this.creditFront = 'rotateY(0deg)';
      this.creditBack = 'rotateY(180deg)';
    }
  }
}
