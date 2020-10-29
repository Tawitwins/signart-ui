
import { Map, Record, List, fromJS } from 'immutable';
import { LignePanier } from '../../shared/modeles/ligne_panier';
import { Commande } from '../../shared/modeles/commande';
/*
export interface CheckoutState extends Map<string, any> {
  orderNumber: number;
  orderId:number;
  orderState: string;
  lineItemIds: List<number>;
  lineItemEntities: Map<number, LignePanier>;
  totalCartItems: number;
  totalCartValue: number;
  billAddress: any;
  shipAddress: any;
  shippingOption: any;
  shippingOptionPrice: number,
  amontShipping:number;
}

export const CheckoutStateRecord = Record({
  orderNumber: null,
  orderId:null,
  orderState: null,
  lineItemIds: List([]),
  lineItemEntities: Map({}),
  totalCartItems: 0,
  totalCartValue: 0,
  billAddress: null, //fromJS({}),
  shipAddress: null, //fromJS({}),
  shippingOption: null,
  shippingOptionPrice: null,
  amontShipping:0
});
*/
export interface CheckoutState{
  orderNumber: number;
  orderId:number;
  orderState: string;
  lineItemIds: number[];
  lineItemEntities: any;
  totalCartItems: number;
  totalCartValue: number;
  billAddress: any;
  shipAddress: any;
  shippingOption: any;
  shippingOptionPrice: number;
  amontShipping:number;
  commande: Commande;
  listAdressesLength: number;
  paymentMode: any;
}
