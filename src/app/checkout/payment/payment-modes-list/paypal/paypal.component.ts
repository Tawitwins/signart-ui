import { Component, AfterViewChecked, Input } from '@angular/core';
import { error } from 'protractor';

declare let paypal: any;
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements AfterViewChecked {

  addScript: boolean = false;
  paypalLoad: boolean = false;
  @Input() public finalAmount: number;

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'Ab5RI0_hcW7Rk_g4XKKAZ_yalO2iTHxZx81AiBdWcbfguBXGd0AoRw4sU7v2gwI2BU-gOl8CcPZmPXER',
      production: 'EBgZcQCubIVd1X-poEHrg5oePgYAfyB7DnoRjLu6fYf9Coe3nMf1njlgOgejHGlthnCBeTYaSd0KCHfM'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: 'USD' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {

      }, error => //console.log('erreur : ' + error))
    }
  };
  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = true;
      }, error => //console.log('erreur : ' + error))
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

}
