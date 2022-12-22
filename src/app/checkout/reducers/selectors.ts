import { CheckoutState } from './checkout.state';
import { AppState } from '../../interfaces';
import { createSelector } from 'reselect';
import { Map, Record, List, fromJS } from 'immutable';

// Base Cart State function
export function getCheckoutState(state: AppState): CheckoutState {

    return state.checkout;
  // }

}

// ******************** Individual selectors ***************************
export function fetchLineItems(state: CheckoutState) {

    const ids = state.lineItemIds;
    // const ids = state.lineItemIds.toJS();
    const lineItemEntitites = state.lineItemEntities;
    // const lineItemEntitites = state.lineItemEntities.toJS();
    return ids.map(id => lineItemEntitites[id]);
  // }

}

export function fetchOrderNumber(state: CheckoutState) {
  return state.orderNumber;
}

export function fetchOrderId(state: CheckoutState) {
  return state.orderId;
}

export function fetchTotalCartItems(state: CheckoutState) {
  return state.totalCartItems;
}

export function fetchTotalCartValue(state: CheckoutState) {
  return state.totalCartValue;
}
export function fetchTotalAmontShipping(state: CheckoutState) {
  return state.amontShipping!== null ? state.amontShipping : null;
}
export function fetchShippingOption(state: CheckoutState) {
  return state.shippingOption!== null ? state.shippingOption:null;
}
export function fetchShippingOptionPrice(state: CheckoutState) {
  return state.shippingOptionPrice;
}

export function fetchShipAddress(state: CheckoutState) {
  return state.shipAddress!== null ? state.shipAddress: null;
}

export function fetchBillAddress(state: CheckoutState) {
  return state.billAddress!== null ? state.billAddress: null;
}
export function fetchOrder(state: CheckoutState) {
  return state.commande;
}

export function fetchOrderState(state: CheckoutState) {
  return state.orderState;
}
export function fetchListAdressesLength(state: CheckoutState) {
  return state.listAdressesLength;
}

// *************************** PUBLIC API's ****************************
export const getLineItems = createSelector(getCheckoutState, fetchLineItems);
export const getOrderNumber = createSelector(getCheckoutState, fetchOrderNumber);
export const getOrderId = createSelector(getCheckoutState, fetchOrderId);
export const getTotalCartItems = createSelector(getCheckoutState, fetchTotalCartItems);
export const getTotalCartValue = createSelector(getCheckoutState, fetchTotalCartValue);
export const getAmontShipping = createSelector(getCheckoutState, fetchTotalAmontShipping);
export const getShippingOption = createSelector(getCheckoutState, fetchShippingOption);
export const getShippingOptionPrice = createSelector(getCheckoutState, fetchShippingOptionPrice);
export const getShipAddress = createSelector(getCheckoutState, fetchShipAddress);
export const getBillAddress = createSelector(getCheckoutState, fetchBillAddress);
export const getOrderState = createSelector(getCheckoutState, fetchOrderState);
export const getOrder = createSelector(getCheckoutState, fetchOrder);
export const getListAdressesLength = createSelector(getCheckoutState, fetchListAdressesLength);
