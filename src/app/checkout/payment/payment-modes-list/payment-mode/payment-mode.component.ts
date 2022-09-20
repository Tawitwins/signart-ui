import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentMode } from '../../../../shared/modeles/payment_mode';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  @Input() paymentMode: PaymentMode;
  @Output() changePaymentMode: EventEmitter<PaymentMode> = new EventEmitter<PaymentMode>();

  constructor() { }

  ngOnInit() {
  }

  onSelectPaymentMode() {
    this.changePaymentMode.emit(this.paymentMode);
  }

}
