
import {tap} from 'rxjs/operators';
import { getAuthStatus } from '../../../auth/reducers/selectors';
import { CheckoutActions } from '../../actions/checkout.actions';
import { AppState } from '../../../interfaces';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { Component, OnInit, Input } from '@angular/core';
import { PaymentMode } from '../../../shared/modeles/payment_mode';
import { CheckoutService } from '../../../shared/services/checkout.service';

declare var $: any;

@Component({
  selector: 'app-payment-modes-list',
  templateUrl: './payment-modes-list.component.html',
  styleUrls: ['./payment-modes-list.component.scss']
})
export class PaymentModesListComponent implements OnInit {

  @Input() paymentAmount: number;
  @Input() orderNumber: number;
  paymentModes: PaymentMode[];
  selectedMode: PaymentMode = new PaymentMode;
  isAuthenticated: boolean;
  maClass: string = 'btn btn-danger btn-round btn-just-ico';
  codePaiement: string;
  
  constructor(private checkoutService: CheckoutService,
    private paymentService: PaymentService,
    private router: Router,
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions) {
      this.store.select(getAuthStatus).subscribe((auth) => {
        this.isAuthenticated = auth;
      });
  }

  ngOnInit() {
    this.fetchAllPayments();
  }

  selectedPaymentMode(mode) {
    this.selectedMode = mode;
  }

  private fetchAllPayments() {
    this.checkoutService.availablePaymentMethods()
      .subscribe((payment) => {
        this.paymentModes = <PaymentMode[]> payment;
        this.selectedMode = this.paymentService.setCODAsSelectedMode(this.paymentModes);
      });
  }

  makePayment() {
    const paymentModeId = this.selectedMode.id;
    this.codePaiement = 'INITIE';
    this.checkoutService.createNewPayment(paymentModeId, this.paymentAmount,this.codePaiement).pipe(
      tap(() => {
        this.store.dispatch(this.checkoutActions.orderCompleteSuccess());
        this.redirectToNewPage();
        this.checkoutService.createEmptyOrder()
          .subscribe();
      }))
      .subscribe();
  }

  private redirectToNewPage() {
    if (this.isAuthenticated) {
      this.router.navigate(['/user', 'orders', 'detail', this.orderNumber]);
    } else {
      this.router.navigate(['/']);
    }
  }

  close(modal: string) {
    $(modal).modal('toggle');
  }

}
