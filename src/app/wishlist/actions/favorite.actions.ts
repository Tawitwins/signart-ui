import { WishItem } from "../../shared/modeles/wish_item";
import { Oeuvre } from "../../shared/modeles/oeuvre";

export class FavoriteActions {
  static ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
  static ADD_TO_WISHLIST_SUCCESS = 'ADD_TO_WISHLIST_SUCCESS';
  static GET_ALL_WISHLIST = 'GET_ALL_WISHLIST';
  static GET_ALL_WISHLIST_SUCCESS = 'GET_ALL_WISHLIST_SUCCESS';
  static DELETE_FROM_WISHLIST = 'DELETE_FROM_WISHLIST';
  static DELETE_FROM_WISHLIST_SUCCESS = 'DELETE_FROM_WISHLIST_SUCCESS';

  addToWishlist(id: number) {
    return {
      type: FavoriteActions.ADD_TO_WISHLIST,
      payload: id
    };
  }

  addToWishlistSuccess(wishItem: WishItem) {
    return {
      type: FavoriteActions.ADD_TO_WISHLIST_SUCCESS,
      payload: wishItem
    };
  }

  getAllWishlist(id: number) {
    return {
      type: FavoriteActions.GET_ALL_WISHLIST,
      payload: id
    };
  }

  getAllWishlistSuccess(oeuvres : any){
    return {
      type: FavoriteActions.GET_ALL_WISHLIST_SUCCESS,
      payload: oeuvres
    };
  }

  removeWishItem (idOeuvre: number){
    return {
      type: FavoriteActions.DELETE_FROM_WISHLIST,
      payload: idOeuvre
    };
  }

  removeWishItemSuccess(idOeuvre: number){
    return {
      type: FavoriteActions.DELETE_FROM_WISHLIST_SUCCESS,
      payload: idOeuvre
    };
  }
}