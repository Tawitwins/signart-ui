import { ItemPaydunya } from './../../../../shared/modeles/itemPaydunya';
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
import { Commande } from 'src/app/shared/modeles/commande';

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
  order:Commande;
  items:ItemPaydunya[]=[];
  constructor(private http: HttpClient,private router:Router, private store: Store<AppState>,private toastr: ToastrService, private checkoutActions: CheckoutActions,) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY':'uAegjohM-djoH-sVyS-icoI-BxeBH4NYsbzX',
        'PAYDUNYA-PRIVATE-KEY':'test_private_qwYm7y1sP2A1l4L2zZ7yhmbwQTr',
        'PAYDUNYA-TOKEN':'U2r9MJIwslXnaff8ZpfH',
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


    this.order = <Commande>JSON.parse(localStorage.getItem('order'));
    this.totalAmount = this.order.total;
    this.shippingOptionPrice = this.order.totalLivraison;
    this.orderId = this.order.id; 
    this.Total = this.totalAmount + this.shippingOptionPrice;


   /*  this.store.select(getTotalCartValue).subscribe(
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
    this.Total = this.totalAmount + this.shiptotal; */
  
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
        
      },
      taxes: {
        tax_0: {
          name: "Livraison",
          amount: this.shippingOptionPrice$,
        }
      },
      total_amount: this.Total ,
      description: "Paiment d'oeuvre d'art"
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
      cancel_url: "http://localhost:4200/pages/order/success",
      return_url:"http://localhost:4200/pages/order/success",
      callback_url: ""
    }
  }
  
  console.log(this.items);
  data.invoice.items=this.convertProductToItems();
  console.log(data);
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
      this.order.modePaiement=this.paymentmode;
      localStorage.setItem('order', JSON.stringify(this.order));
      window.location.href=this.answer.response_text;
    }
  })
}
  convertProductToItems(){
    this.order.lignesCommande.forEach(elet => {
      console.log(elet);
      console.log(new ItemPaydunya(elet.oeuvre.nom,elet.oeuvre.description,elet.prix,elet.prix*elet.quantite,elet.quantite));
      this.items.push(new ItemPaydunya(elet.oeuvre.nom,elet.oeuvre.description,elet.prix,+elet.prix*elet.quantite,elet.quantite));
    });
    let jsonObject = {};  
    let i=0
    for(i=0;i<this.items.length;i++){
      console.log(this.items[i]);
      jsonObject["item_"+i] = this.items[i];
    }
    console.log(jsonObject);
    /* let json = JSON.stringify(jsonObject);  
    console.log(json); */
    return jsonObject;
  }
}
