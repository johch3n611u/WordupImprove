import { Component } from '@angular/core';

@Component({
  selector: 'ec-fake-credit-card-verification-page',
  templateUrl: './fake-credit-card-verification-page.component.html',
  styleUrls: ['./fake-credit-card-verification-page.component.scss']
})
export class FakeCreditCardVerificationPageComponent {

  cardNumber: string = '';
  cardHolder: string = '';
  cardExpirationMonth: string = '';
  cardExpirationYear: string = '';
  cardCCV: string = '';

  onCardNumberChange(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.value.length > 3) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    this.cardNumber = '';
    const inputCartNumbers = document.querySelectorAll('.input-cart-number');
    for (let i = 0; i < inputCartNumbers.length; i++) {
      const inputValue = (inputCartNumbers[i] as HTMLInputElement).value;
      this.cardNumber += inputValue + ' ';
      if (inputValue.length === 4) {
        const nextInput = (inputCartNumbers[i] as HTMLInputElement).nextElementSibling as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  onCardHolderChange(event: any) {
    const input = event.target as HTMLInputElement;
    this.cardHolder = input.value;
  }

  onCardExpirationMonthChange(event: any) {
    const select = event.target as HTMLSelectElement;
    const selectedIndex = select.selectedIndex;
    this.cardExpirationMonth = ((selectedIndex < 10) ? '0' + selectedIndex : selectedIndex).toString();
    this.updateCardExpirationDate();
  }

  onCardExpirationYearChange(event: any) {
    const input = event.target as HTMLInputElement;
    this.cardExpirationYear = input.value.substr(2, 2);
    this.updateCardExpirationDate();
  }

  onCardCCVChange(event: any) {
    const input = event.target as HTMLInputElement;
    this.cardCCV = input.value;
  }

  private updateCardExpirationDate() {
    const month = this.cardExpirationMonth;
    const year = this.cardExpirationYear;
    // Update the card expiration date display
  }

  // $('.input-cart-number').on('keyup change', function(){
  //   $t = $(this);

  //   if ($t.val().length > 3) {
  //     $t.next().focus();
  //   }

  //   var card_number = '';
  //   $('.input-cart-number').each(function(){
  //     card_number += $(this).val() + ' ';
  //     if ($(this).val().length == 4) {
  //       $(this).next().focus();
  //     }
  //   })

  //   $('.credit-card-box .number').html(card_number);
  // });

  // $('#card-holder').on('keyup change', function(){
  //   $t = $(this);
  //   $('.credit-card-box .card-holder div').html($t.val());
  // });

  // $('#card-holder').on('keyup change', function(){
  //   $t = $(this);
  //   $('.credit-card-box .card-holder div').html($t.val());
  // });

  // $('#card-expiration-month, #card-expiration-year').change(function(){
  //   m = $('#card-expiration-month option').index($('#card-expiration-month option:selected'));
  //   m = (m < 10) ? '0' + m : m;
  //   y = $('#card-expiration-year').val().substr(2,2);
  //   $('.card-expiration-date div').html(m + '/' + y);
  // })

  // $('#card-ccv').on('focus', function(){
  //   $('.credit-card-box').addClass('hover');
  // }).on('blur', function(){
  //   $('.credit-card-box').removeClass('hover');
  // }).on('keyup change', function(){
  //   $('.ccv div').html($(this).val());
  // });


  // /*--------------------
  // CodePen Tile Preview
  // --------------------*/
  // setTimeout(function(){
  //   $('#card-ccv').focus().delay(1000).queue(function(){
  //     $(this).blur().dequeue();
  //   });
  // }, 500);
}
