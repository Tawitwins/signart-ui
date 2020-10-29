import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getTotalCartValue, getShippingOptionPrice, getOrderId } from 'app/checkout/reducers/selectors';
import { PaymentMode } from 'app/shared/modeles/payment_mode';
import { CheckoutService } from 'app/shared/services/checkout.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/interfaces';
import { CheckoutActions } from 'app/checkout/actions/checkout.actions';
import { AuthServiceS } from 'app/shared/services/auth.service';
import { AuthActions } from 'app/auth/actions/auth.actions';
import Swal from 'sweetalert2';

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
  constructor(private http: HttpClient,private router:Router, private store: Store<AppState>,private toastr: ToastrService, private checkoutActions: CheckoutActions,) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY':'MSPkQ7iw-e2oN-bOMl-uzS6-9aKAxF7yptPk',
        'PAYDUNYA-PRIVATE-KEY':'test_private_ZybynlsnAK9Do8QTah4jkAsADpv',
        'PAYDUNYA-TOKEN':'sRPvcOG1Z72e1UwEE4vN',
      })
    };
    /*this.store.select(getTotalCartValue).subscribe(
      res => {
        this.totalAmount = res;
      }
    );
      this.store.select(getShippingOptionPrice).subscribe(
      response => {
        this.shippingOptionPrice = response;
        console.log('ship value', this.shippingOptionPrice)
      });*/
    this.store.select(getOrderId).subscribe(
      response => {
        this.orderId = response;
        console.log('Order number ', this.orderId)
      }
    );
    this.store.select(getShippingOptionPrice).subscribe(resp => { this.shiptotal = resp});
    this.Total = this.totalAmount + this.shiptotal;
  
  }

  /* ============================@PSR==========================  
  // API path
  base_path = 'https://app.paydunya.com/sandbox-api/v1/opr';
  
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'PAYDUNYA-MASTER-KEY': 'Y6fnMXwR-kI2B-yHgH-Hv1A-PI7wtj1cj42U',
      'PAYDUNYA-PRIVATE-KEY': 'test_private_pTNam0LvsVijvKfYkb03O8QqCbw',
      'PAYDUNYA-TOKEN': 'V2PQCXC4WINFjccqDZcW'
    })
  }
 // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Une erreur est survenue: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  // Create a new item data

  createPayment(item): Observable<any> {
    return this.http
      .post<any>(this.base_path+ '/create', JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  chargePayment(item): Observable<any> {
    return this.http
      .post<any>(this.base_path+ '/charge', JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

sendPayment(){    
    this.data = {
      "invoice_data" : {
        "invoice": {
          "total_amount": this.Total, 
          "description": "Peinture a huile"},
        "store": {
          "name": "Gallery Signart"}
        },"opr_data" :{
          "account_alias" : "bayeseydyna@gmail.com"}
        };

    this.createPayment(this.data).subscribe(
      async res => {
        console.log(res);
        const { value: key } = await Swal.fire({
          title: 'Clé de validation envoyé',
          input: 'number',
          inputPlaceholder: 'Renseigner la clé ici'
        })
        
        if (key) {
          this.data = {"token" : `${res.token}`, "confirm_token" : `${key}`}
          //Swal.fire(`votre clé: ${key}`)
          this.chargePayment(this.data).subscribe(
            resp => {
              console.log('second response : ', resp)
              if(resp.response_code	=== "00"){
                let url: string = resp.invoice_data.receipt_url;
                console.log('ma route: ', url)
                window.location.assign(url);
                //this.router.
              }
            }
          );
          
        }
      }
    );
  }
  =================================@PSR====================================*/

  ngOnInit() {
    //this.sendPayment();
    
    //this.createPayment(this.data);
    /*let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');*/
  }
  onpay(objet){   
    return this.http.post(this.host+`/sandbox-api/v1/checkout-invoice/create`,JSON.stringify(objet),this.httpOptions)
  }
  onconfirm(token){
    return this.http.get(this.host+`/sandbox-api/v1/checkout-invoice/confirm/${token}`,this.httpOptions)
  }
  //`commande/${id}`
  sendPayment(){
  
  /*let  data={"invoice": 
    {"total_amount": 5000, "description": "Designed by Kalidou Kassé"},
    "store": {"name": "SignArt"}
  }*/
 
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
      total_mount: this.Total,
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
     ) 
    },
    (error)=>{
      console.log('Réponse avec erreur',error)
    }
  );
  }
  /*
  sendPayment(){
    this.data = {
      "invoice_data" : {
        "invoice": {
          "total_amount": 15000, 
          "description": "Chaussure VANS dernier modèle"},
        "store": {
          "name": "Magasin le Choco"}
        },"opr_data" :{
          "account_alias" : "bayeseydyna@gmail.com"}
        };

    this.createPayment(this.data).subscribe(
      res => {
        console.log(res);
      }
    );
  }
*/
onglet(url){
  window.open(url);       
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
      var user = localStorage.getItem('user');
      var auth = localStorage.getItem('auth');
          localStorage.clear();
          localStorage.setItem('auth',auth);
          localStorage.setItem('user',user);
      
      window.location.href=this.answer.response_text;
    }
  })
}
}
