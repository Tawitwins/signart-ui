import { Record, Map, List } from 'immutable';
import { Oeuvre } from '../../shared/modeles/oeuvre';
import { WishItem } from '../../shared/modeles/wish_item';

export interface FavoriteState{
    totalWishlistItems: any;
    wishItemIds: any;
    wishItemEntities:any;
    idClient:any;
}
/*
export interface FavoriteState extends Map<string, any> {
    totalWishlistItems: any;
    wishItemIds: List<any>;
    wishItemEntities: Map<any, any>;
    idClient:any;
}

export const FavoriteStateRecord = Record({
    totalWishlistItems: 0,
    wishItemIds: List([]),
    wishItemEntities:Map({}),
    idClient:3 //à modifier
});
*/
