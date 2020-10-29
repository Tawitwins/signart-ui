import { CheckoutActions } from '../actions/checkout.actions';
import { getTotalCartValue, getOrderNumber, getTotalCartItems,getShippingOptionPrice,getShippingOption,getShipAddress, getAmontShipping, getOrder} from '../reducers/selectors';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Address } from '../../shared/modeles/address';
import { Commande } from 'app/shared/modeles/commande';
import { LigneCommande } from 'app/shared/modeles/ligneCommande';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  totalCartValue: number;
  totalCartItems: number;
  address$: Observable<Address>;
  orderNumber$: Observable<number>;
  amontShipping$: Observable<number>;
  Order: Commande;
  shippingOption$: Observable<number>;
  shippingOptionPrice$: Observable<number>;
  shippingOptionPrice: number;
  lignesCommande: LigneCommande[];
  image: string;
  monindex: any= null;


  constructor(private store: Store<AppState>, public checkoutActions: CheckoutActions, private router: Router) {
      this.store.select(getTotalCartValue).subscribe(
        res => {
          this.totalCartValue = res;
          console.log('value : ', this.totalCartValue)
        }
      );
      this.store.select(getTotalCartItems).subscribe(
        resp => {
          this.totalCartItems = resp;
        }
      );
      this.totalCartItems$ = this.store.select(getTotalCartItems);
      this.totalCartValue$ = this.store.select(getTotalCartValue);
      this.amontShipping$ = this.store.select(getAmontShipping);
      this.address$ = this.store.select(getShipAddress);
      this.orderNumber$ = this.store.select(getOrderNumber);
      this.shippingOption$ = this.store.select(getShippingOption);
      this.store.select(getShippingOptionPrice).subscribe(
          reponse => {
            this.shippingOptionPrice = reponse;
            console.log('shipprice : ', this.shippingOptionPrice)
          }
      );
      this.shippingOptionPrice$ = this.store.select(getShippingOptionPrice);
      this.store.select(getOrder).subscribe(
        (resp) => {
          this.Order = <Commande>resp;
          if(this.Order !== null){
            this.lignesCommande = this.Order.lignesCommande;
            //this.image = environment.API_ENDPOINT + 'image/oeuvre/' + this.lignesCommande[this.monindex].oeuvre.id;
            console.log('La commande : ', this.lignesCommande)
          }/*else{
            localStorage.removeItem('panier');
            localStorage.removeItem('livraison');
            this.router.navigate(['/', 'success']);
          }*/
          
        }
      );
      
  }

  ngOnInit() {
    
  }

 /* setmonIndexe(index: any){
    this.monindex = index;
    return index;
  }*/
  onConfirmOrder(){
    
  }

}
