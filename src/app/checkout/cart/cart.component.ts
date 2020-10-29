import { Router } from '@angular/router';
import { getTotalCartValue, getOrderState, getTotalCartItems, getLineItems } from '../reducers/selectors';
import { Observable } from 'rxjs';
import { CheckoutActions } from '../actions/checkout.actions';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  // stateSub$: Subscription;
  // orderState: string;

  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;

  constructor(private store: Store<AppState>, private router: Router) {

    this.totalCartValue$ = this.store.select(getTotalCartValue);
    this.totalCartItems$ = this.store.select(getTotalCartItems);
    // this.stateSub$ = this.store.select(getOrderState)
    //   .subscribe(state => this.orderState = state);
  }

  ngOnInit() {
    // if (this.orderState === 'delivery' || this.orderState === 'address') {

    //   this.router.navigate(['/checkout', 'address']);
    // } else if (this.orderState === 'payment') {

    //   this.router.navigate(['/checkout', 'payment']);
    // }
  }

  // ngOnDestroy(){
  //   this.stateSub$.unsubscribe();
  // }

}
