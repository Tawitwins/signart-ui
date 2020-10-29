import { AppState } from '../../interfaces';
import { ArticleState } from './article-state';
import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';
// import { Image } from '../../shared/modeles/image';
import { Oeuvre } from '../../shared/modeles/oeuvre';

// Base product state selector function
export function  getProductState(state: AppState): ArticleState {
  return state.articles;
}

// ******************** Individual selectors ***************************
export function fetchProducts(state: ArticleState) {
  const ids = state.productIds;
  const productEntities = state.productEntities;
  return ids.map(id => productEntities[id]);
}

export function fetchAllTaxonomies(state: ArticleState) {
  return state.taxonomies.toJS();
}

const fetchSelectedProduct = function (state: ArticleState): Oeuvre {
  return state.selectedProduct;
};

// *************************** PUBLIC API's ****************************
export const getSelectedProduct = createSelector(getProductState, fetchSelectedProduct);
export const getProducts = createSelector(getProductState, fetchProducts);
export const getTaxonomies = createSelector(getProductState, fetchAllTaxonomies);
