import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentMode } from 'app/shared/modeles/payment_mode';
import { Observable } from 'rxjs';
import { getTotalCartValue, getShippingOptionPrice, getOrderId } from 'app/checkout/reducers/selectors';
import { CheckoutService } from 'app/shared/services/checkout.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/interfaces';
import { Router } from '@angular/router';
import { CheckoutActions } from 'app/checkout/actions/checkout.actions';
import { AuthServiceS } from 'app/shared/services/auth.service';
import { AuthActions } from 'app/auth/actions/auth.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cash-on-delivery',
  templateUrl: './cash-on-delivery.component.html',
  styleUrls: ['./cash-on-delivery.component.scss']
})
export class CashOnDeliveryComponent implements OnInit {

  @Output() payOnDelivery: EventEmitter<boolean> = new EventEmitter<boolean>();
  paymentmode: PaymentMode ={id:null, code:'', libelle:''};
  orderId: number;
  totalCartValue$: Observable<number>;
  shippingOptionPrice$: Observable<number>;
  totalCartValue: number;
  shippingOptionPrice: number;
  codePaiement: string;

  constructor(private store: Store<AppState>, private checkouS: CheckoutService, private router: Router, private checkoutActions: CheckoutActions, private auth: AuthActions) { 
    this.store.select(getTotalCartValue).subscribe(
      resp => {
        this.totalCartValue = resp;
        console.log('total value', this.totalCartValue)
      }
    );
    this.store.select(getShippingOptionPrice).subscribe(
      response => {
        this.shippingOptionPrice = response;
        console.log('ship value', this.shippingOptionPrice)
      });
    this.store.select(getOrderId).subscribe(
      response => {
        this.orderId = response;
        console.log('Order number ', this.orderId)
      }
    );
  }

  ngOnInit() {
  }

  onPay() {
    this.paymentmode.id=2;
    this.paymentmode.code = 'ESPECE';
    this.paymentmode.libelle='Espèces a la livraison';
    this.codePaiement = 'INITIE'
    //localStorage.setItem('mode_payment', JSON.stringify(this.paymentmode));
    console.log('paiement : ', this.paymentmode);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous avez choisie "+this.paymentmode.libelle,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuer!',
      cancelButtonText: 'Anuler'
    }).then((result) => {
      if (result.value) {
        this.store.dispatch(this.checkoutActions.addPaymentModeSuccess(this.paymentmode));
        Swal.fire(
          'Vous allez payer une fois livré!',
        ).then((reslt) => {
          if (reslt.value) {
          this.store.dispatch(this.checkoutActions.orderCompleteSuccess());
          this.router.navigate(['/', 'success']);
        }
        })
        this.checkouS.createNewPayment(this.paymentmode.id, this.orderId, this.codePaiement).subscribe(
          response => {
            console.log('Le retour paiement ', response)
          }
        );
      }
    })
    //let montant = (this.totalCartValue + this.shippingOptionPrice);
    //this.store.dispatch(this.auth.logoutSuccess());
    //this.store.dispatch(this.checkoutActions.orderCompleteSuccess());
    // localStorage.removeItem('panier');
    //localStorage.removeItem('livraison');
    //this.router.navigate(['/', 'success']);
    
    //this.payOnDelivery.emit(true);
  }

}
