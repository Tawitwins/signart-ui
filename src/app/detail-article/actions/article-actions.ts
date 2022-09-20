import { Action } from '@ngrx/store';
import { Image } from '../../shared/modeles/image';

export class ArticleActions {
    static GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
    static GET_ALL_PRODUCTS_SUCCESS = 'GET_ALL_PRODUCTS_SUCCESS';
    static GET_PRODUCT_DETAIL = 'GET_PRODUCT_DETAIL';
    static GET_PRODUCT_DETAIL_SUCCESS = 'GET_PRODUCT_DETAIL_SUCCESS';
    static CLEAR_SELECTED_PRODUCT = 'CLEAR_SELECTED_PRODUCT';
    static GET_ALL_TAXONOMIES = 'GET_ALL_TAXONOMIES';
    static GET_ALL_TAXONOMIES_SUCCESS = 'GET_ALL_TAXONOMIES_SUCCESS';
  
    getAllProducts() {
        return {
            type: ArticleActions.GET_ALL_PRODUCTS,
        };
    }

    getProductDetail(id: string) {
        return {
            type: ArticleActions.GET_PRODUCT_DETAIL,
            payload: id
        };
    }

    getAllProductsSuccess(products: any) {
        return {
            type: ArticleActions.GET_ALL_PRODUCTS_SUCCESS,
            payload: products
         };
    }

    getProductDetailSuccess(product: Image) {
        return {
            type: ArticleActions.GET_PRODUCT_DETAIL_SUCCESS,
            payload: product
        };
    }

    clearSelectedProduct() {
        return { type: ArticleActions.CLEAR_SELECTED_PRODUCT };
    }

    getAllTaxonomies() {
        return { type: ArticleActions.GET_ALL_TAXONOMIES };
    }

    getAllTaxonomiesSuccess(taxonomies: any) {
        return {
            type: ArticleActions.GET_ALL_TAXONOMIES_SUCCESS,
            payload: taxonomies
        };
    }
}
