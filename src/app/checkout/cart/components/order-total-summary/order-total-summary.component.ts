
import { tap } from 'rxjs/operators';
import { getOrderState, getShipAddress } from '../../../reducers/selectors';
import { Router } from '@angular/router';
import { CheckoutActions } from '../../../actions/checkout.actions';
import { AppState } from '../../../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { getAuthStatus } from '../../../../auth/reducers/selectors';
import { User } from 'firebase';
import { Client } from 'src/app/shared/modeles/client';
import { AuthServiceS } from 'src/app/shared/services/auth.service';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';

declare var $: any;
@Component({
  selector: 'app-order-total-summary',
  templateUrl: './order-total-summary.component.html',
  styleUrls: ['./order-total-summary.component.scss']
})
export class OrderTotalSummaryComponent implements OnInit, OnDestroy {
  user: User;
  data: any;
  public client: Client;
  stateSub$: Subscription;
  orderState: string;
  @Input() totalCartValue: number;
  reduction: number = 15;
  totalCommande: number;
  isAuthenticated: boolean;


  constructor(private store: Store<AppState>,
    private authS: AuthServiceS,
    private oeuvreS: OeuvreService,
    private actions: CheckoutActions,
    private checkoutService: CheckoutService,
    private router: Router) {
    this.user = this.authS.getUserConnected();
    this.stateSub$ = this.store.select(getOrderState)
      .subscribe(state => this.orderState = state);
  }

  ngOnInit() {
    
  }

  placeOrder() {
    //Test d'abord si l'utilisateur est connecté
    if (this.user === null) {
      this.router.navigate(['/auth', 'account']);
      $.notify({
        icon: "notifications",
        message: "Vous devez vous authentifier avant la commande!"
      }, {
        type: 'warning',
        timer: 2000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    }
     else {
      this.oeuvreS.getClientByUser(parseInt(this.user.id))
        .subscribe(
          response => {
            this.client = response;
            localStorage.setItem('client',JSON.stringify(response));
            if (this.orderState === 'panier') {
              this.data = JSON.parse(localStorage.getItem('panier'));
              this.checkoutService.createOrder(this.client.id, this.data).pipe(
                tap(() => {
                  this.router.navigate(['/checkout', 'address']);
                  //localStorage.removeItem('panier');
                }))
                .subscribe();
            } else {
              this.router.navigate(['/checkout', 'address']);
            }
          });
    }

  }
  ngOnDestroy() {
    this.stateSub$.unsubscribe();
  }
}
