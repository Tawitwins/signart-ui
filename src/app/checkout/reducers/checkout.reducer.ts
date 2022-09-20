import { CheckoutActions } from '../actions/checkout.actions';
import { CheckoutState /*,CheckoutStateRecord*/} from './checkout.state';
import { Action, ActionReducer } from '@ngrx/store';
import { LineItem } from '../../shared/modeles/line_item';
import { LignePanier } from '../../shared/modeles/ligne_panier';
import { Commande } from '../../shared/modeles/commande';


//export const initialState: CheckoutState = new CheckoutStateRecord() as unknown as CheckoutState;


// export function retrieveState() {
//   return (localStorage.getItem('completeState'));
// }

export const initialState:CheckoutState={
  orderNumber: 0,
  orderId:0,
  orderState: 'initial',
  lineItemIds: [0],
  lineItemEntities: {},
  totalCartItems: 0,
  totalCartValue: 0,
  billAddress: null, //fromJS({}),
  shipAddress: null, //fromJS({}),
  shippingOption : null,
  shippingOptionPrice: 0,
  amontShipping:0,
  commande: null,
  listAdressesLength: null,
  paymentMode: null
};

export function reducer(state = initialState, { type, payload, amountShipp }: any): CheckoutState {

  let _lineItems, _lineItemEntities, _lineItemIds,
    _lineItem, _lineItemEntity, _lineItemId,
    _totalCartItems = 0, _totalCartValue,
    _ship_address, _bill_address,
    _orderState, _panier, _amontShipping, _commande,_shippingOption, _shippingOptionPrice,_paymentmode, _listAdressesLength;

  switch (type) {

    // case CheckoutActions.FETCH_CURRENT_ORDER_SUCCESS:
    //   const _orderNumber = payload.number;
    //   _lineItems = payload.line_items;
    //   _lineItemIds = _lineItems.map(lineItem => lineItem.id);
    //   _totalCartItems = payload.total_quantity;
    //   _totalCartValue = parseFloat(payload.total);
    //   _ship_address = payload.ship_address;
    //   _bill_address = payload.bill_address;
    //   _orderState = payload.state;

    //   _lineItemEntities = _lineItems.reduce((lineItems: { [id: number]: LineItem }, lineItem: LineItem) => {
    //     return Object.assign(lineItems, {
    //       [lineItem.id]: lineItem
    //     });
    //   }, {});

    //   return state.merge({
    //     orderNumber: _orderNumber,
    //     orderState: _orderState,
    //     lineItemIds: _lineItemIds,
    //     lineItemEntities: _lineItemEntities,
    //     totalCartItems: _totalCartItems,
    //     totalCartValue: _totalCartValue,
    //     shipAddress: _ship_address,
    //     billAddress: _bill_address
    //   }) as CheckoutState;

    case CheckoutActions.ADD_TO_CART_SUCCESS:
      _panier = payload;

      //Réinitialisation du state
      state = initialState;
      _lineItemIds = _panier.lignesPanier.map(lignePanier => lignePanier.id);
      _lineItemEntities = _panier.lignesPanier.reduce((lignesPanier: { [id: number]: LignePanier }, lignePanier: LignePanier) => {
        return Object.assign(lignesPanier, {
          [lignePanier.id]: lignePanier
        });
      }, {});
      _totalCartItems = _panier.nbTotal;
      _totalCartValue = parseFloat(_panier.total);
      _orderState = 'panier';
      _amontShipping = _panier.totalLivraison;

      return {
        ...state,
        lineItemIds: _lineItemIds,
        lineItemEntities: _lineItemEntities,
        totalCartItems: _totalCartItems,
        totalCartValue: _totalCartValue,
        orderState: _orderState,
        amontShipping: _amontShipping
      };

    case CheckoutActions.GET_ALL_LINE_ITEMS_SUCCESS:
      console.log('lignes panier : ' + payload.lignePaniers);
      _totalCartItems = state.totalCartItems;
      _totalCartValue = state.totalCartValue;
      _lineItems = payload.lignePaniers;
      _lineItemIds = _lineItems.map(lignePanier => lignePanier.id);
      _lineItemEntities = _lineItems.reduce((lignesPanier: { [id: number]: LignePanier }, lignePanier: LignePanier) => {
        return Object.assign(lignesPanier, {
          [lignePanier.id]: lignePanier
        });
      }, {});
      return {
        ...state,
        lineItemIds: _lineItemIds,
        lineItemEntities: _lineItemEntities,
        totalCartItems: _totalCartItems,
        totalCartValue: _totalCartValue
      };

    case CheckoutActions.REMOVE_LINE_ITEM_SUCCESS:
      _lineItem = payload;
      _lineItemId = _lineItem.id;
      const index = state.lineItemIds.indexOf(_lineItemId);
      if (index >= 0) {
        _lineItemIds = state.lineItemIds.splice(index, 1);
        //Suppression de l'element
        _lineItemEntities = state.lineItemEntities; 
        Object.keys(_lineItemEntities).forEach(function (key) {
          if(key.match(_lineItemId)) delete _lineItemEntities[key];
         });
         _lineItemIds = state.lineItemIds;
         _lineItemEntities = state.lineItemEntities;
        // _lineItemEntities = state.lineItemEntities.delete(_lineItemId);
        _totalCartItems = state.totalCartItems - _lineItem.quantite;
        _totalCartValue = state.totalCartValue - parseFloat(_lineItem.total);
        _amontShipping = state.amontShipping - _lineItem.totalLivraison;
      }

      return {
        ...state,
        lineItemIds: _lineItemIds,
        lineItemEntities: _lineItemEntities,
        totalCartItems: _totalCartItems,
        totalCartValue: _totalCartValue,
        amontShipping: _amontShipping
      };

    case CheckoutActions.CHANGE_LINE_ITEM_QUANTITY_SUCCESS:
      //const quantity = payload.quantite;
      //const total = payload.total;
      const lineItemId = payload.id;
      _lineItemEntities = state.lineItemEntities;
      //_lineItemEntities[lineItemId].quantite = quantity;
      //_lineItemEntities[lineItemId].total = total;
      _totalCartItems = state.totalCartItems + _lineItemEntities[lineItemId].quantite;
      _totalCartValue = (state.totalCartValue  - _lineItemEntities[lineItemId].prix) + _lineItemEntities[lineItemId].total;
      
      return {
        ...state,
        lineItemEntities: _lineItemEntities,
        totalCartItems: _totalCartItems,
        totalCartValue: _totalCartValue
      };

      case CheckoutActions.CHANGE_LINE_ITEM_QUANTITY_UP_SUCCESS:
      //const quantity = payload.quantite;
      //const total = payload.total;
      const Id = payload.id;
      _lineItemEntities = state.lineItemEntities;
      _lineItemEntities[Id].quantite = payload.quantite;
      _lineItemEntities[Id].total = payload.total;
      _totalCartItems = state.totalCartItems + 1;
      _totalCartValue = state.totalCartValue + _lineItemEntities[Id].prix;
      
      return {
        ...state,
        lineItemEntities: _lineItemEntities,
        totalCartItems: _totalCartItems,
        totalCartValue: _totalCartValue
      };

      case CheckoutActions.CHANGE_LINE_ITEM_QUANTITY_DOWN_SUCCESS:
      //const quantity = payload.quantite;
      //const total = payload.total;
      const ID = payload.id;
      _lineItemEntities = state.lineItemEntities;
      _lineItemEntities[ID].quantite = payload.quantite;
      _lineItemEntities[ID].total = payload.prix;
      _totalCartItems = state.totalCartItems - 1;
      _totalCartValue = state.totalCartValue - _lineItemEntities[ID].prix;
      
      return {
        ...state,
        lineItemEntities: _lineItemEntities,
        totalCartItems: _totalCartItems,
        totalCartValue: _totalCartValue
      };


    case CheckoutActions.CHANGE_ORDER_STATE:

    case CheckoutActions.CHANGE_ORDER_STATE_SUCCESS:
      _orderState = payload.state;


      return {
        ...state,
        orderState: _orderState
      };

    case CheckoutActions.PLACE_ORDER_SUCCESS:
      // _orderState = payload.state;
      //Réinitialisation du state
      //state = initialState;
      _commande = payload;
      _orderState = _commande.state;
      const _numeroCommande = payload.numero;
      const _orderId = payload.id;

      _lineItemIds = _commande.lignesCommande.map(commande => commande.id);
      _lineItemEntities = _commande.lignesCommande.reduce((lignesCommande: { [id: number]: Commande }, commande: Commande) => {
        return Object.assign(lignesCommande, {
          [commande.id]: commande
        });
      }, {});
      //_totalCartItems = _commande.nbTotal;
      //_totalCartValue = parseFloat(_commande.total);
      _amontShipping = _commande.totalLivraison;

      return {
        ...state,
        orderState: _orderState,
        orderNumber: _numeroCommande,
        orderId: _orderId,
        lineItemIds: _lineItemIds,
        lineItemEntities: _lineItemEntities,
        //totalCartItems: _totalCartItems,
        //totalCartValue: _totalCartValue,
        amontShipping: _amontShipping,
        commande: _commande
      };

    case CheckoutActions.UPDATE_ORDER_SUCCESS:
      _ship_address = payload.adresseLivraison;
      _bill_address = payload.adresseFacturation;
      _commande = state.commande;
      _commande.adresseLivraison = _ship_address ;
      _commande.adresseFacturation = _bill_address;

      return {
        ...state,
        shipAddress: _ship_address,
        billAddress: _bill_address,
        commande: _commande
      };

    case CheckoutActions.UPDATE_ORDER_ADRESS_SUCCESS:
          _ship_address = payload;
          _bill_address = payload;
          _commande = state.commande;
          _commande.adresseLivraison = _ship_address ;
          _commande.adresseFacturation = _bill_address;
    
        return {
            ...state,
            shipAddress: _ship_address,
            billAddress: _bill_address,
            commande: _commande
          };

    case CheckoutActions.ADD_SHIPPING_METHODE:
        _shippingOption = payload;
        _shippingOptionPrice = amountShipp;
        _commande = state.commande;
        _commande.shippingOption = _shippingOption;
        _commande.shippingOptionPrice = _shippingOptionPrice;

        return {
          ...state,
          shippingOption: _shippingOption,
          shippingOptionPrice: _shippingOptionPrice,
          commande: _commande
        };

    case CheckoutActions.ORDER_COMPLETE_SUCCESS:
      return initialState;

    case CheckoutActions.UPDATE_ORDER_ADRESS_NUMBER_SUCCESS:
      _listAdressesLength = payload;
      return {
        ...state,
        listAdressesLength: _listAdressesLength
      };

      case CheckoutActions.ADD_PAYMENT_MODE_SUCCESS:
        _paymentmode = payload;
        return {
          ...state,
          paymentMode: _paymentmode
        }; 

    default: return state;
    // if (retrieveState()) {
    //   var newState = JSON.parse(localStorage.getItem('completeState'));
    //   return newState.checkout;
    // } else {
    //   return state;
    // }
  }
};


