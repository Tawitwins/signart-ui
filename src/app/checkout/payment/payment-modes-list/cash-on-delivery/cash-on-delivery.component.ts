import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaymentMode } from '../../../../shared/modeles/payment_mode';
import { AppState } from '../../../../interfaces';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { CheckoutActions } from '../../../actions/checkout.actions';
import { AuthActions } from '../../../../auth/actions/auth.actions';
import { getTotalCartValue, getShippingOptionPrice, getOrderId } from '../../../reducers/selectors';
import { Commande } from '../../../../shared/modeles/commande';
import { PaiementEtLigneP } from 'src/app/shared/modeles/paiementEtLignesP';

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
  order: Commande = new Commande();

  constructor(private store: Store<AppState>,private checkoutService:CheckoutService, private router: Router, private checkoutActions: CheckoutActions, private auth: AuthActions) { 
  /*   this.store.select(getTotalCartValue).subscribe(
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
    ); */
    this.order = JSON.parse(localStorage.getItem('order'));
  }

  ngOnInit() {
  }

  onPay() {
    this.paymentmode.id=2;
    this.paymentmode.code = 'ESPECE';
    this.paymentmode.libelle='Espèces a la livraison';
    this.codePaiement = 'INITIE';
    //localStorage.setItem('mode_payment', JSON.stringify(this.paymentmode));
    console.log('paiement : ', this.paymentmode);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous avez choisi "+this.paymentmode.libelle,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuer!',
      cancelButtonText: 'Anuler'
    }).then((result) => {
      if (result.value) {
        //this.store.dispatch(this.checkoutActions.addPaymentModeSuccess(this.paymentmode));
        Swal.fire(
          'Vous allez payer une fois livré!',
        ).then((reslt) => {
          if (reslt.value) {
          this.order.modePaiement = this.paymentmode; 
          this.store.dispatch(this.checkoutActions.orderCompleteSuccess());
          localStorage.setItem('order', JSON.stringify(this.order));
          let paiement = new PaiementEtLigneP();
          paiement.lignePaiements = [];
          paiement.codeEtatPaiement="INITIE";
          paiement.codeModePaiement=this.order.modePaiement.code;
          paiement.datePaiement=new Date();
          paiement.idCommande=this.order.id;
          paiement.id = this.order.id;
          this.checkoutService.postPaiement(paiement).subscribe(resp => {
            console.log(resp);
            this.router.navigate(['/pages/order/success']);
          });
        }
        })
        /* this.checkouS.createNewPayment(this.paymentmode.id, this.order, this.codePaiement).subscribe(
          response => {
            console.log('Le retour paiement ', response)
          }
        ); */
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
