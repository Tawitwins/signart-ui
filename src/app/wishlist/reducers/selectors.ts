import { createSelector } from 'reselect';
import { FavoriteState } from './favorite.state';
import { AppState } from '../../interfaces';
import { List } from 'immutable';

/******************* Base favorite state selector function ******************/
export function getFavoriteState(state: AppState): FavoriteState {
  return state.favorite;
}

/******************* Individual selectors ******************/
export function fetchTotalWishlistItems(state: FavoriteState) {
  return state.totalWishlistItems;
}

export function fetchAllWishlist(state: FavoriteState) {
  const ids = state.wishItemIds;
  // console.log('ids : '+JSON.stringify(ids));
  const wishItemEntities = state.wishItemEntities;
  return ids.map(id => wishItemEntities[id]);

}

/******************* Public Selector API's ******************/
export const getTotalWishlistItems = createSelector(getFavoriteState, fetchTotalWishlistItems);
export const getAllWishlist = createSelector(getFavoriteState, fetchAllWishlist);
