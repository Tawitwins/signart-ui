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
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { Abonnement } from 'src/app/shared/modeles/utilisateur';
import { storage } from 'firebase';
import { environment } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-paydunya',
  templateUrl: './paydunya.component.html',
  styleUrls: ['./paydunya.component.scss']
})
export class PaydunyaComponent implements OnInit {

  @Output() payOnDunya: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setTokenEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() isAbonnement:boolean;
  @Input() abonnement:Abonnement;
  @Input() abonnementId:number;
  @Input() listing:boolean;
  paymentmode: PaymentMode ={id:null, code:'', libelle:''};
  orderId: number;
  totalCartValue$: Observable<number>;
  shippingOptionPrice$: Observable<number>;
  totalCartValue: number;
  shippingOptionPrice: number;
  //--------
  data: any;
  private hostpaydunya : String='https://app.paydunya.com';
  private host : String=' http://localhost:8085/';
  httpOptions;
  answer:any;
  totalAmount: number;
  shiptotal: number;
  Total: number;
  res:any;
  itemize:any[];
  order:Commande;
  items:ItemPaydunya[]=[];
  tauxPaydunya: number = 2/100;
  constructor(
    private http: HttpClient,
    private imageService:ImageService, 
    private store: Store<AppState>,
    private checkoutService:CheckoutService, 
    private checkoutActions: CheckoutActions,
    private translate: TranslateService,
    ) {
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
    this.totalAmount = this.order?.montant;
    this.shippingOptionPrice = this.order?.totalLivraison;
    this.orderId = this.order?.id; 
    this.Total = this.totalAmount + this.shippingOptionPrice;
    this.Total = (this.Total+100)/(1-this.tauxPaydunya)

   /*  this.store.select(getTotalCartValue).subscribe(
      res => {
        this.totalAmount = res;
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
    );
    this.store.select(getShippingOptionPrice).subscribe(resp => { this.shiptotal = resp});
    this.Total = this.totalAmount + this.shiptotal; */
  
  }


  ngOnInit() {

  }
  onpay(objet){   
    return this.http.post(`/paiement/api/paydunya/create-invoice`,objet)
  }
  /*
  onconfirm(token){
    return this.http.get(this.host+`/sandbox-api/v1/checkout-invoice/confirm/${token}`,this.httpOptions)
  }*/
  sendPayment(){ 

  let data={
    payDunyaInput: {
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
        logo_url: "https://lh3.googleusercontent.com/ogw/AOh-ky3njWTf1eU8loMeFpCwS4Fr7pQxk90R1pEt1M0j=s64-c-mo",
        website_url: ""
      },
      custom_data: {
    
      },
      actions: {
        cancel_url: `${environment.serverUrl}/shop/checkout`,
        return_url:`${environment.serverUrl}/pages/order/success`,
        callback_url: ""
      }
    }
  }
  
  //console.log(this.items);
  data.payDunyaInput.invoice.items=this.convertProductToItems();
  //console.log(data);
  this.onpay(data).subscribe(
    (response)=>{
     //console.log('Ma réponse',response);
     this.answer=response; 
     this.updateCommandeToken(response);
     //console.log('Answer',response)
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
          //console.log('Erreur lors de la  confirmation')
        }
     ) */
    },
    (error)=>{
      //console.log('Réponse avec erreur',error)
    }
  );
  }
  sendAbonnementPayment(){ 
    let data={
      payDunyaInput: {
        invoice: {
          items: {
            
          },
          taxes: {
          },
          total_amount: 0,
          description: "Paiment d'oeuvre d'art"
        },
        store: {
          name: "SignArt",
          tagline: "",
          postal_address: "Dakar Plateau_Avenue Lamine Gueye",
          phone: "774698944",
          logo_url: "https://lh3.googleusercontent.com/ogw/AOh-ky3njWTf1eU8loMeFpCwS4Fr7pQxk90R1pEt1M0j=s64-c-mo",
          website_url: ""
        },
        custom_data: {
      
        },
        actions: {
          cancel_url: `${environment.serverUrl}/shop/collection/abonnement-catalogue`,
          return_url:`${environment.serverUrl}/pages/dashboard`,
          callback_url: ""
        }
      }
    }
    if(this.abonnement.id){
      this.imageService.getAbonnementById(this.abonnement.id).subscribe(resp => {
        data.payDunyaInput.invoice.total_amount = resp.montantPaiement;
      });
    }
    //data.payDunyaInput.invoice.items=this.convertProductToItems();
    //console.log(data);
    this.translate.get('PopupAvertissement').subscribe(popupAv => {
      this.translate.get('PopupTextPaydunya',{paymentmodeLibelle: this.paymentmode.libelle}).subscribe(popupTextPaydunya => {
        this.translate.get('PopupCancelBtn').subscribe(cancel => {
          this.translate.get('PopupConfirmBtn').subscribe(confirm => {
            Swal.fire({
              title: popupAv,
              text: popupTextPaydunya,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: ' #376809',
              cancelButtonColor: 'red',
              cancelButtonText: cancel,
              confirmButtonText: confirm,
            }).then((result) => {
              if (result.value) {
                this.onpay(data).subscribe(
                  (response)=>{
                  //console.log('Ma réponse',response);
                  this.answer=response; 
                  this.updateAbonnementToken(response);
                  //console.log('Answer',response)
                  },
                  (error)=>{
                    //console.log('Réponse avec erreur',error)
                  }
                );
              }
            })
          })
        })
      })
    })
    // Swal.fire({
    //   title: 'Êtes-vous sûr?',
    //   text: 'Vous avez choisi ' +this.paymentmode.libelle +'. Vous allez être redirigé(e) sur la plateforme paydunya ...',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: ' #376809',
    //   cancelButtonColor: 'red',
    //   confirmButtonText: 'Continuer!',
    //   cancelButtonText: 'Annuler',
    //   reverseButtons: true,
    // }).then((result) => {
    //   if (result.value) {
    //     this.onpay(data).subscribe(
    //       (response)=>{
    //        //console.log('Ma réponse',response);
    //        this.answer=response; 
    //        this.updateAbonnementToken(response);
    //        //console.log('Answer',response)
    //       },
    //       (error)=>{
    //         //console.log('Réponse avec erreur',error)
    //       }
    //     );
    //   }
    // })
    }

//----------------------------------
Pay() {
  this.paymentmode.id=8;
  this.paymentmode.code = 'PAYDUNYA';
  this.paymentmode.libelle='Paydunya';
  //localStorage.setItem('mode_payment', JSON.stringify(this.paymentmode));
  //console.log('paiement : ', this.paymentmode);
  this.translate.get('PopupAvertissement').subscribe(popupAv => {
    this.translate.get('PopupTextPaydunya',{paymentmodeLibelle: this.paymentmode.libelle}).subscribe(popupTextPaydunya => {
      this.translate.get('PopupCancelBtn').subscribe(cancel => {
        this.translate.get('PopupConfirmBtn').subscribe(confirm => {
          Swal.fire({
            title: popupAv,
            text: popupTextPaydunya,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: ' #376809',
            cancelButtonColor: 'red',
            cancelButtonText: cancel,
            confirmButtonText: confirm,
          }).then((result) => {
            if (result.value) {
              this.store.dispatch(this.checkoutActions.addPaymentModeSuccess(this.paymentmode));
              this.order.modePaiement=this.paymentmode;
              localStorage.setItem('order', JSON.stringify(this.order));
              window.location.href=this.answer.response_text;
            }
          })
        })
      })
    })
  })
  // Swal.fire({
  //   title: 'Êtes-vous sûr?',
  //   text: 'Vous avez choisi ' +this.paymentmode.libelle +'. Vous allez être redirigé(e) sur la plateforme paydunya ...',
  //   icon: 'warning',
  //   showCancelButton: true,
  //   confirmButtonColor: ' #376809',
  //   cancelButtonColor: 'red',
  //   confirmButtonText: 'Continuer!',
  //   cancelButtonText: 'Annuler',
  //   reverseButtons: true,
  // }).then((result) => {
  //   if (result.value) {
  //     this.store.dispatch(this.checkoutActions.addPaymentModeSuccess(this.paymentmode));
  //     this.order.modePaiement=this.paymentmode;
  //     localStorage.setItem('order', JSON.stringify(this.order));
  //     //console.log("PARFAIT: ",this.answer.response_text)
  //     window.location.href=this.answer.response_text;
  //   }
  // })
}
  convertProductToItems(){
    this.order.lignesCommande.forEach(elet => {
      //console.log(elet);
      //console.log(new ItemPaydunya(elet.oeuvre.nom,elet.oeuvre.description,elet.prix,elet.prix*elet.quantite,elet.quantite));
      this.items.push(new ItemPaydunya(elet.oeuvre.nom,elet.oeuvre.description,elet.prix,+elet.prix*elet.quantite,elet.quantite));
    });
    let jsonObject = {};  
    let i=0
    for(i=0;i<this.items.length;i++){
      //console.log(this.items[i]);
      jsonObject["item_"+i] = this.items[i];
    }
    //console.log(jsonObject);
    /* let json = JSON.stringify(jsonObject);  
    //console.log(json); */
    return jsonObject;
  }
  updateCommandeToken(response){
    this.checkoutService.getCommandeById(this.order.id).subscribe(resp => {
      let splitted =  response.response_text.split("invoice/");
      resp.token = splitted[1];
      //console.log(resp);
      this.checkoutService.updateCommande(this.order.id,resp).subscribe(response => {
        //console.log(response);
      });
    });
  }
  updateAbonnementToken(response){
    if(this.abonnement.id){
      this.imageService.getAbonnementById(this.abonnement.id).subscribe(resp => {
        let splitted =  response.response_text.split("invoice/");
        resp.token = splitted[1];
        //console.log(resp);
        this.imageService.updateAbonnement(resp).subscribe(response => {
          //console.log(response);
           window.location.href=this.answer.response_text;
        });
      });
    }
    else{
      this.setTokenEvent.emit(response.response_text.split("invoice/")[1]);
    }
  }
}
