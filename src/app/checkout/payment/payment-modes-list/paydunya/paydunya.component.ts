import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { PaymentMode } from '../../../../shared/modeles/payment_mode';
import { LigneCommande } from '../../../../shared/modeles/ligneCommande';
import { AppState } from '../../../../interfaces';
import { CheckoutActions } from '../../../actions/checkout.actions';
import { getTotalCartValue, getShippingOptionPrice, getOrderId } from '../../../reducers/selectors';

@Component({
  selector: 'app-paydunya',
  templateUrl: './paydunya.component.html',
  styleUrls: ['./paydunya.component.scss']
})
export class PaydunyaComponent implements OnInit {

  @Output() payOnDunya: EventEmitter<boolean> = new EventEmitter<boolean>();
  paymentmode: PaymentMode ={id:null, code:'', libelle:''};
  orderId: number;
  totalCartValue$: Observable<number>;
  shippingOptionPrice$: Observable<number>;
  totalCartValue: number;
  shippingOptionPrice: number;
  //--------
  data: any;
  private host : String='https://app.paydunya.com';
  httpOptions;
  answer:any;
  totalAmount: number;
  shiptotal: number;
  Total: number;
  res:any;
  itemize:any[];
  //@Input() public commandeLine:LigneCommande[]; 
  constructor(private http: HttpClient,private router:Router, private store: Store<AppState>,private toastr: ToastrService, private checkoutActions: CheckoutActions,) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY':'MSPkQ7iw-e2oN-bOMl-uzS6-9aKAxF7yptPk',
        'PAYDUNYA-PRIVATE-KEY':'test_private_ZybynlsnAK9Do8QTah4jkAsADpv',
        'PAYDUNYA-TOKEN':'sRPvcOG1Z72e1UwEE4vN',
      })
    };
    /*
    for(let i=0 ;this.commandeLine.length;i++){
       this.itemize[i]={
        name: "Chaussures Croco",
        quantity: 3,
        unit_price: "10000",
        total_price: "30000",
        description: "C"
       }
    }*/
    this.store.select(getTotalCartValue).subscribe(
      res => {
        this.totalAmount = res;
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
    this.store.select(getShippingOptionPrice).subscribe(resp => { this.shiptotal = resp});
    this.Total = this.totalAmount + this.shiptotal;
  
  }


  ngOnInit() {

  }
  onpay(objet){   
    return this.http.post(this.host+`/sandbox-api/v1/checkout-invoice/create`,JSON.stringify(objet),this.httpOptions)
  }
  /*
  onconfirm(token){
    return this.http.get(this.host+`/sandbox-api/v1/checkout-invoice/confirm/${token}`,this.httpOptions)
  }*/
  sendPayment(){ 
  let data={
    invoice: {
      items: {
        item_0: {
          name: "Chaussures Croco",
          quantity: 3,
          unit_price: "10000",
          total_price: "30000",
          description: "Chaussures faites en peau de crocrodile authentique qui chasse la pauvreté"
        },
        item_1: {
          name: "Chemise Glacée",
          quantity: 1,
          unit_price: "5000",
          total_price: "5000",
          description: ""
        }
      },
      taxes: {
        tax_0: {
          name: "Livraison",
          amount: 1000
        }
      },
      total_amount: this.Total,
      description: ""
    },
    store: {
      name: "SignArt",
      tagline: "",
      postal_address: "Dakar Plateau_Avenue Lamine Gueye",
      phone: "774698944",
      logo_url: "",
      website_url: ""
    },
    custom_data: {
  
    },
    actions: {
      cancel_url: "",
      return_url:"http://localhost:4200/success",
      callback_url: ""
    }
  }
  this.onpay(data).subscribe(
    (response)=>{
     console.log('Ma réponse',response);
     this.answer=response;
     console.log('Answer',response)
    // window.location.href=this.answer.response_text;
    /*
     this.onconfirm(this.answer.token).subscribe(
        (response)=>{
          this.res=response;
          if(this.res.status=="completed"){
          this.toastr.success("Votre transaction a été prise en compte","Processus de paiement");
           this.onglet(this.res.receipt_url) 
          }
          
        },
        (error)=>{
          console.log('Erreur lors de la  confirmation')
        }
     ) */
    },
    (error)=>{
      console.log('Réponse avec erreur',error)
    }
  );
  }

//----------------------------------
Pay() {
  this.paymentmode.id=8;
  this.paymentmode.code = 'PAYDUNYA';
  this.paymentmode.libelle='Paydunya';
  //localStorage.setItem('mode_payment', JSON.stringify(this.paymentmode));
  console.log('paiement : ', this.paymentmode);
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Vous avez choisi ' +this.paymentmode.libelle +'. Vous allez être redirigé(e) sur la plateforme paydunya ...',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: ' #f07c10',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Continuer!',
    cancelButtonText: 'Anuler'
  }).then((result) => {
    if (result.value) {
      this.store.dispatch(this.checkoutActions.addPaymentModeSuccess(this.paymentmode));
      
      window.location.href=this.answer.response_text;
    }
  })
}
}
