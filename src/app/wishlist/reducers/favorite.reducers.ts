import { FavoriteState,/* FavoriteStateRecord */} from "./favorite.state";
import { FavoriteActions } from "../actions/favorite.actions";
import { Oeuvre } from "../../shared/modeles/oeuvre";

export const initialState: FavoriteState ={
    totalWishlistItems:JSON.parse(localStorage.getItem('totalwishItem')),
    wishItemIds: [],
    wishItemEntities:{},
    idClient:1031 //à modifier
};
//export const initialState: FavoriteState = new FavoriteStateRecord() as unknown as FavoriteState;

export function reducer(state = initialState, { type, payload }: any): FavoriteState {
    
    let _totalWishlistItems =JSON.parse(localStorage.getItem('totalwishItem')), _wishItemEntities, _wishItem, _wishItemId, _wishItemIds, _idClient;

    switch (type) {
        case FavoriteActions.ADD_TO_WISHLIST_SUCCESS:
            _wishItem = payload;
            _wishItemId = _wishItem.idOeuvre;
            _idClient = _wishItem.idClient;

            // return the same state if the item is already included.
            /*
            if (_idClient == 3) {
                if (state.wishItemIds.includes(_wishItemId)) {
                    return state;
                }

            }*/
            _totalWishlistItems = state.totalWishlistItems + 1;
            _wishItemEntities = { [_wishItemId]: _wishItem };
           // _wishItemIds = state.wishItemIds.push(_wishItemId);

            return {
                ...state,
               // wishItemEntities:_wishItemEntities,//state.wishItemEntities.merge(_wishItemEntities),
                totalWishlistItems: _totalWishlistItems,
                wishItemIds: _wishItemIds,
                idClient: _idClient
            };

        case FavoriteActions.DELETE_FROM_WISHLIST_SUCCESS:
            _wishItemId = payload;
            const index = state.wishItemIds.indexOf(_wishItemId);
            if (index >= 0) {
                _wishItemIds = state.wishItemIds.splice(index, 1);
                _wishItemEntities = state.wishItemEntities.delete(_wishItemId);
                _totalWishlistItems = state.totalWishlistItems - 1;
            }

            return{
                ...state,
                wishItemIds: _wishItemIds,
                wishItemEntities: _wishItemEntities,
                totalWishlistItems: _totalWishlistItems
            };

        // case FavoriteActions.GET_ALL_WISHLIST_SUCCESS:
        //     console.log('oeuvres favorites : '+payload.oeuvres);
        //     const _oeuvres = payload.oeuvres;
        //     _oeuvresEntities = _oeuvres.reduce((oeuvres: { [id: number]: Oeuvre }, oeuvre: Oeuvre) => {
        //         return Object.assign(oeuvres, {
        //             [oeuvre.id]: oeuvre
        //         });
        //     }, {});
        //     _wishItemEntities = state.wishItemEntities;
        //     console.log('wishiTems : '+ Array.from(_wishItemEntities.keys()));
        //     _totalWishlistItems = state.totalWishlistItems;
        //     return state.merge({
        //         wishItemEntities: _wishItemEntities,
        //         totalWishlistItems: _totalWishlistItems,
        //         oeuvresEntities: _oeuvresEntities
        //     }) as FavoriteState;
        default: return state;
        // if (retrieveState()) {
        //     var newState = JSON.parse(localStorage.getItem('completeState'));
        //     return newState.favorite;
        //   } else {
        //     return state;
        //   }
    }
}
