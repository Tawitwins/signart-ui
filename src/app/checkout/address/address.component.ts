import {tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { getShipAddress, getOrderState, getOrderNumber, getShippingOption, getOrder, getListAdressesLength } from '../reducers/selectors';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription ,  Observable } from 'rxjs';
import { Address } from '../../shared/modeles/address';
import { CheckoutService } from '../../shared/services/checkout.service';
import { getAuthStatus } from '../../auth/reducers/selectors';

import { NgForm } from '@angular/forms';
import { CheckoutActions } from '../actions/checkout.actions';
import { ModeLivraison } from '../../shared/modeles/mode_livraison';
import { Commande } from '../../shared/modeles/commande';
import { AuthServiceS } from '../../shared/services/auth.service';
import { OeuvreService } from '../../shared/services/oeuvre.service';
declare var $:any;
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {

  stateSub$: Subscription;
  orderState: string;
  orderNumber$: Observable<number>;
  shipAddress$: Observable<Address>;
  listAdressesLength$: Observable<number>;
  shipOption: ModeLivraison= null;
  orderSubs$: Observable<Commande>;
  order: Commande;
  isAuthenticated: boolean;
  user: any;
  client:any;
  nom: string;
  prenom: string;
  mail: string;
  listAdresses: any;
  listAdressesLength: number;
  nombreAdresses: number;
  adresse:any;
  adresseLivraison:any[];
  constructor(private store: Store<AppState>,
    private checkoutService: CheckoutService,
    private router: Router,
    private oeuvreS: OeuvreService,
    private authS: AuthServiceS,
    private actions: CheckoutActions,
    ) {
    this.orderNumber$ = this.store.select(getOrderNumber);
    this.store.select(getOrder).subscribe(
      resp => {
        this.order = <Commande>resp
      });
    this.stateSub$ = this.store.select(getOrderState)
      .subscribe(state => this.orderState = state);
      this.user = this.authS.getUserConnected();
      this.mail = this.user.email;
      this.prenom = this.user.prenom;
      this.nom = this.user.nom;

      this.store.select(getShipAddress).subscribe(res => this.adresse = res);
      //console.log('ship adress',this.adresse);
  }

  ngOnInit() {
    /*
    this.client = this.oeuvreS.getClientByUser(parseInt(this.user.id)).subscribe(
      (client) => {
        this.client = client;
      }
    );*/
    this.oeuvreS.getClientByUser(parseInt(this.user.id)).subscribe(
      (response) => {
        this.client = response;
        //console.log('client',this.client);
        localStorage.setItem('client',JSON.stringify(response))
        this.checkoutService.getAdresseByClient(this.client.id).subscribe(
          resp => {
            this.listAdresses = resp;
            //c'est pour afficher uniquement les adresses de livraison(pas de facturation)
            for(let i=0;i<this.listAdressesLength;i++){
            if(this.listAdresses[i].codeTypeAdresse=='LIVRAISON'){
              this.adresseLivraison=this.listAdresses[i];
              //console.log('les adresses de livraison',this.adresseLivraison)
            }
          }
            this.nombreAdresses = this.listAdresses.length;
            this.listAdressesLength = this.nombreAdresses;
            //console.log('les adresses: ', resp)
            //console.log('nombre adresses', this.listAdressesLength)
            this.store.dispatch(this.actions.updateOrderAdressNumberSuccess(this.nombreAdresses));
          }
        );
      }
    );
    
    ////console.log('user : ',this.user);
    ////console.log('client',response);
    /*
    this.store.select(getAuthStatus).subscribe((auth) => {
      this.isAuthenticated = auth;
      if (!this.isAuthenticated) {
        this.router.navigate(['/auth', 'account']);
      } else {
        this.shipAddress$ = this.store.select(getShipAddress);
        //console.log('Adresse de livraison',this.shipAddress$);
      }
    });*/
    this.store.select(getListAdressesLength).subscribe(
      (response) => {
        this.listAdressesLength = response;
        //console.log('laaaaaaaaaaaa reponse nombre adresses', this.listAdressesLength);
      }
    );

    this.shipAddress$ = this.store.select(getShipAddress);
    //this.shipOption$ = this.store.select(getShippingOption);
    ////console.log('Adresse de livraison',this.shipAddress$);
    this.store.select(getShippingOption).subscribe(
      (response) => {
        this.shipOption = response;
        //console.log('laaaa reponse', this.shipOption);
      }
    );
  }
  checkoutToPayment() {
    if (this.order.shippingOption !== undefined) {
      this.checkoutService.changeOrderState().subscribe();
      this.checkoutService.createLivraison(this.order).subscribe(
        (resp) => {//console.log('resp livraison ', resp)}
      );
      this.router.navigate(['/checkout', 'payment']);
    }   
    else if(this.adresse === null && this.orderState === "adresse"){
      $.notify({
        icon: "notifications",
        message: "Veuillez renseigner l'adresse !"
      }, {
        type: 'danger',
        timer: 2000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    }else if(this.order.shippingOption === undefined){
      $.notify({
        icon: "notifications",
        message: "Choisissez un mode de livraison avant de continuer !"
      }, {
        type: 'danger',
        timer: 2000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    }
  }
  
  onSubmit(form: NgForm) {
    let adress: Address;
      const index = form.value['monadresse'];
      //console.log('resultat', index);
      adress = this.listAdresses[index];
      //console.log('addresse est : ', adress)
      this.store.dispatch(this.actions.updateOrderAdressSuccess(adress));
      $.notify({
        icon: "notifications",
        message: "Votre adresse est prise en compte veuillez continuer !"
      }, {
        type: 'success',
        timer: 2000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
      
  }
  

  ngOnDestroy() {
    if (this.orderState === 'delivery') {
      this.checkoutService.changeOrderState()
        .subscribe();
    }
    this.stateSub$.unsubscribe();
  }

}
