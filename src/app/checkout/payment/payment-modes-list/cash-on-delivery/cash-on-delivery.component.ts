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
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private store: Store<AppState>,
    private checkoutService:CheckoutService, 
    private router: Router, 
    private checkoutActions: CheckoutActions, 
    private auth: AuthActions,
    private toastService:ToastrService,
    private translate: TranslateService
    ) { 
  /*   this.store.select(getTotalCartValue).subscribe(
      resp => {
        this.totalCartValue = resp;
        //console.log('total value', this.totalCartValue)
      }
    );
    this.store.select(getShippingOptionPrice).subscribe(
      response => {
        this.shippingOptionPrice = response;
        //console.log('ship value', this.shippingOptionPrice)
      });
    this.store.select(getOrderId).subscribe(
      response => {
        this.orderId = response;
        //console.log('Order number ', this.orderId)
      }
    ); */
    this.order = JSON.parse(localStorage.getItem('order'));
  }

  ngOnInit() {
  }

  onPay() {
    this.paymentmode.id=2;
    this.paymentmode.code = 'MAGASIN';
    this.paymentmode.libelle='A la galerie';
    this.codePaiement = 'NOPAYE';
    //localStorage.setItem('mode_payment', JSON.stringify(this.paymentmode));
    //console.log('paiement : ', this.paymentmode);

    this.translate.get('PopupAvertissement').subscribe(popupAv => {
      this.translate.get('PopupChoixPaymentMode').subscribe(choixPM => {
        this.translate.get('PopupCancelBtn').subscribe(cancel => {
          this.translate.get('PopupConfirmBtn').subscribe(confirm => {
            Swal.fire({
              title: popupAv,
              text: choixPM +this.paymentmode.libelle,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: ' #376809',
              cancelButtonColor: 'red',
              cancelButtonText: cancel,
              confirmButtonText: confirm,
            }).then((result) => {
              if (result.value) {
                //this.store.dispatch(this.checkoutActions.addPaymentModeSuccess(this.paymentmode));
                this.translate.get('PopupPayAfterDelivery').subscribe(popup => {
                  this.translate.get('SUCCESS').subscribe(alertType=>{
                    this.toastService.success(popup, alertType)
        
                    this.order.modePaiement = this.paymentmode; 
                    this.store.dispatch(this.checkoutActions.orderCompleteSuccess());
                    localStorage.setItem('order', JSON.stringify(this.order));
                    let paiement = new PaiementEtLigneP();
                    paiement.lignePaiements = [];
                    paiement.codeEtatPaiement="NOPAYE";
                    paiement.codeModePaiement=this.order.modePaiement.code;
                    paiement.datePaiement=new Date();
                    paiement.idCommande=this.order.id;
                    paiement.id = this.order.id;
                    this.checkoutService.putPaiement(paiement).subscribe(resp => {
                      //console.log(resp);
                      this.router.navigate(['/pages/order/success']);
                    });
                  })
        
                  })
        
                // Swal.fire(
                //   'Vous allez payer une fois livré!',
                // ).then((reslt) => {
                //   if (reslt.value) {
            
                // }
                // })
                /* this.checkouS.createNewPayment(this.paymentmode.id, this.order, this.codePaiement).subscribe(
                  response => {
                    //console.log('Le retour paiement ', response)
                  }
                ); */
              }
            })
          })
        })
      })
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
