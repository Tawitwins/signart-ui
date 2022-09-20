
import { CheckoutActions } from '../actions/checkout.actions';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { CheckoutService } from '../../shared/services/checkout.service';
import { LineItem } from '../../shared/modeles/line_item';
import { Oeuvre } from '../../shared/modeles/oeuvre';
import { LignePanier } from '../../shared/modeles/ligne_panier';
import { WishItem } from '../../shared/modeles/wish_item';
import { Panier } from '../../shared/modeles/panier';
import {
  switchMap,
  map,
  tap
} from 'rxjs/operators';
import { ofType } from '@ngrx/effects';
import { AppState } from 'app/interfaces';

@Injectable()
export class CheckoutEffects {

  constructor(private actions$: Actions,
    private checkoutService: CheckoutService,
    private checkoutActions: CheckoutActions,
    private store: Store<AppState>, ) { }

  // tslint:disable-next-line:member-ordering
  // @Effect()
  // AddToCart$: Observable<Action> = this.actions$
  //   .pipe(
  //     ofType(CheckoutActions.ADD_TO_CART),
  //     switchMap((action: any) => this.checkoutService.createNewLineItemInLocalStorage(action.payload)),
  //     map((panier: Panier) => this.checkoutActions.addToCartSuccess(panier)));
  @Effect({ dispatch: false })
  AddToCart$: Observable<any> = this.actions$
    .pipe(
      ofType(CheckoutActions.ADD_TO_CART),
      tap((action: any) => {
        let panier: Panier = this.checkoutService.createNewLineItemInLocalStorage(action.payload);
        this.store.dispatch(this.checkoutActions.addToCartSuccess(panier));
      }));


  @Effect()
  getAllLineItems$: Observable<Action> = this.actions$
    .pipe(
      ofType(CheckoutActions.GET_ALL_LINE_ITEMS),
      switchMap((action: any) => this.checkoutService.getLineItems()),
      map((data: any) => this.checkoutActions.getAllLineItemsSuccess({ lignesPanier: data })));

  @Effect({ dispatch: false })
  getAllLineItemsLocal$: Observable<any> = this.actions$
    .pipe(
      ofType(CheckoutActions.GET_ALL_LINE_ITEMS_LOCAL),
      tap((action: any) => {
        let lignesPanier: LignePanier[] = this.checkoutService.getLineItemsInLocalStorage();
        this.store.dispatch(this.checkoutActions.getAllLineItemsLocalSuccess({ lignePaniers: lignesPanier }));
      }));

  // @Effect()
  // changeLineItemQuantity$: Observable<Action>= this.actions$
  // .ofType(CheckoutActions.CHANGE_LINE_ITEM_QUANTITY)
  // .switchMap((action: any) => this.checkoutService.updateQuantity(action.payload.quantity, action.payload.lineItemId))
  // .map((lignePanier: LignePanier) => this.checkoutActions.changeLineItemQuantitySucess(lignePanier));

}
  // @Effect()
    // FetchCurrentOrder$ = this.actions$
    // .ofType(CartActions.FETCH_CURRENT_ORDER)
    // .switchMap((action: any) => {
    //   return this.cartService.fetchCurrentOrder();
    // })
    // .map((order: Order) => {
    //   return this.cartActions.fetchCurrentOrderSuccess(order);
    // });



  // Use this effect once angular releases RC4

  // @Effect()
  //   RemoveLineItem$ = this.actions$
  //   .ofType(CartActions.REMOVE_LINE_ITEM)
  //   .switchMap((action: any) => {
  //     return this.cartService.deleteLineItem(action.payload);
  //   })
  //   .map(() => this.cartActions.removeLineItemSuccess());

