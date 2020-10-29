
import { Action } from '@ngrx/store';
import { LineItem } from '../../shared/modeles/line_item';
import { Order } from '../../shared/modeles/order';
import { Oeuvre } from '../../shared/modeles/oeuvre';
import { LignePanier } from '../../shared/modeles/ligne_panier';
import { WishItem } from '../../shared/modeles/wish_item';
import { Commande } from '../../shared/modeles/commande';
import { Panier } from '../../shared/modeles/panier';
import { ModeLivraison } from '../../shared/modeles/mode_livraison';
import { Address } from '../../shared/modeles/address';
import { PaymentMode } from '../../shared/modeles/payment_mode';

export class CheckoutActions {
  static FETCH_CURRENT_ORDER = 'FETCH_CURRENT_ORDER';
  static FETCH_CURRENT_ORDER_SUCCESS = 'FETCH_CURRENT_ORDER_SUCCESS';
  static ADD_TO_CART = 'ADD_TO_CART';
  static ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
  static REMOVE_LINE_ITEM = 'REMOVE_LINE_ITEM';
  static REMOVE_LINE_ITEM_SUCCESS = 'REMOVE_LINE_ITEM_SUCCESS';
  static CHANGE_LINE_ITEM_QUANTITY = 'CHANGE_LINE_ITEM_QUANTITY';
  static CHANGE_LINE_ITEM_QUANTITY_SUCCESS = 'CHANGE_LINE_ITEM_QUANTITY_SUCCESS';
  static CHANGE_LINE_ITEM_QUANTITY_UP_SUCCESS = 'CHANGE_LINE_ITEM_QUANTITY_UP_SUCCESS';
  static CHANGE_LINE_ITEM_QUANTITY_DOWN_SUCCESS = 'CHANGE_LINE_ITEM_QUANTITY_DOWN_SUCCESS';
  static PLACE_ORDER = 'PLACE_ORDER';
  static PLACE_ORDER_SUCCESS = 'PLACE_ORDER_SUCCESS';
  static CHANGE_ORDER_STATE = 'CHANGE_ORDER_STATE';
  static CHANGE_ORDER_STATE_SUCCESS = 'CHANGE_ORDER_STATE_SUCCESS';
  static UPDATE_ORDER = 'UPDATE_ORDER';
  static UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
  static UPDATE_ORDER_ADRESS_SUCCESS = 'UPDATE_ORDER_ADRESS_SUCCESS';
  static ORDER_COMPLETE_SUCCESS = 'ORDER_COMPLETE_SUCCESS';
  static GET_ALL_LINE_ITEMS = 'GET_ALL_LINE_ITEMS';
  static GET_ALL_LINE_ITEMS_LOCAL = 'GET_ALL_LINE_ITEMS_LOCAL';
  static GET_ALL_LINE_ITEMS_LOCAL_SUCCESS = 'GET_ALL_LINE_ITEMS_LOCAL_SUCCESS';
  static GET_ALL_LINE_ITEMS_SUCCESS = 'GET_ALL_LINE_ITEMS_SUCCESS';
  static ADD_SHIPPING_METHODE = 'ADD_SHIPPING_METHODE';
  static UPDATE_ORDER_ADRESS_NUMBER_SUCCESS ='UPDATE_ORDER_ADRESS_NUMBER_SUCCESS';
  static ADD_PAYMENT_MODE_SUCCESS ='ADD_PAYMENT_MODE_SUCCESS';
  



  getAllLineItems() {
    return {
      type: CheckoutActions.GET_ALL_LINE_ITEMS
    };
  }

  getAllLineItemsLocal() {
    return {
      type: CheckoutActions.GET_ALL_LINE_ITEMS_LOCAL
    };
  }
  
  getAllLineItemsLocalSuccess(lignePaniers: any) {
    return {
      type: CheckoutActions.GET_ALL_LINE_ITEMS_SUCCESS,
      payload: lignePaniers
    };
  }
  getAllLineItemsSuccess(lignePaniers: any) {
    return {
      type: CheckoutActions.GET_ALL_LINE_ITEMS_SUCCESS,
      payload: lignePaniers
    };
  }
  fetchCurrentOrder() {
    return { type: CheckoutActions.FETCH_CURRENT_ORDER };
  }

  fetchCurrentOrderSuccess(order: Order) {
    return {
      type: CheckoutActions.FETCH_CURRENT_ORDER_SUCCESS,
      payload: order
    };
  }

  addToCart(oeuvre: Oeuvre) {
    return {
      type: CheckoutActions.ADD_TO_CART,
      payload: oeuvre
    };
  }

  addToCartSuccess(panier: Panier) {
    return {
      type: CheckoutActions.ADD_TO_CART_SUCCESS,
      payload: panier
    };
  }

  removeLineItem(lineItemId: number) {
    return {
      type: CheckoutActions.REMOVE_LINE_ITEM,
      payload: lineItemId
    };
  }

  removeLineItemSuccess(lignePanier: LignePanier) {
    return {
      type: CheckoutActions.REMOVE_LINE_ITEM_SUCCESS,
      payload: lignePanier
    };
  }

  changeLineItemQuantity(quantity: number, lineItemId: number) {
    return {
      type: CheckoutActions.CHANGE_LINE_ITEM_QUANTITY,
      payload: { quantity, lineItemId }
    };
  }

  changeLineItemQuantitySuccess(lignePanier: LignePanier) {
    return {
      type: CheckoutActions.CHANGE_LINE_ITEM_QUANTITY_SUCCESS,
      payload: lignePanier
    };
  }
  changeLineItemQuantityUpSuccess(lignePanier: LignePanier) {
    return {
      type: CheckoutActions.CHANGE_LINE_ITEM_QUANTITY_UP_SUCCESS,
      payload: lignePanier
    };
  }
  changeLineItemQuantityDownSuccess(lignePanier: LignePanier) {
    return {
      type: CheckoutActions.CHANGE_LINE_ITEM_QUANTITY_DOWN_SUCCESS,
      payload: lignePanier
    };
  }

  placeOrder() {
    return { type: CheckoutActions.PLACE_ORDER };
  }

  placeOrderSucces(order: Commande) {
    return {
      type: CheckoutActions.PLACE_ORDER_SUCCESS,
      payload: order
    };
  }

  changeOrderState() {
    return { type: CheckoutActions.CHANGE_ORDER_STATE };
  }

  changeOrderStateSuccess(order: Commande) {
    return {
      type: CheckoutActions.CHANGE_ORDER_STATE_SUCCESS,
      payload: order
    };
  }

    addPaymentModeSuccess(paymentMode: PaymentMode) {
    return {
      type: CheckoutActions.ADD_PAYMENT_MODE_SUCCESS,
      payload: paymentMode
    };
  }

  updateOrder() {
    return { type: CheckoutActions.UPDATE_ORDER };
  }

  updateOrderSuccess(orderAdress: Address) {
    return {
      type: CheckoutActions.UPDATE_ORDER_SUCCESS,
      payload: orderAdress
    };
  }
  updateOrderAdressSuccess(orderAdress: Address) {
    return {
      type: CheckoutActions.UPDATE_ORDER_ADRESS_SUCCESS,
      payload: orderAdress
    };
  }

  updateOrderAdressNumberSuccess(AdresseNumber: number) {
    return {
      type: CheckoutActions.UPDATE_ORDER_ADRESS_NUMBER_SUCCESS,
      payload: AdresseNumber
    };
  }

  orderCompleteSuccess() {
    return { type: CheckoutActions.ORDER_COMPLETE_SUCCESS };
  }
  addShippingMethodeSuccess(shipping: ModeLivraison, amountShipping: number) {
    return {
      type: CheckoutActions.ADD_SHIPPING_METHODE,
      payload: shipping,
      amountShipp: amountShipping
    };
  }

}
