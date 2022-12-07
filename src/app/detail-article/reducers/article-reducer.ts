import { ArticleActions } from '../actions/article-actions';
import { ArticleState /*ArticleStateRecord */} from './article-state';
import { Action, ActionReducer } from '@ngrx/store';
import { Image } from '../../shared/modeles/image';
import { Taxonomy } from '../../shared/modeles/taxonomy';
import { Oeuvre } from '../../shared/modeles/oeuvre';
//export const initialState: ArticleState = new ArticleStateRecord() as unknown as ArticleState;


export const initialState: ArticleState ={
  productIds: [16,17],
  productEntities:{
   16: {artiste:"Kalidou KASSE",couleur:"Blanc",dateAjout:"2018-06-25T13:43:00Z",description:"Sculpture bois",fraisLivraison:1500,id:16,idArtiste:4,idSousTechnique:1,idTechnique:1,nom:"Sculpture bois",nouveau:false,prix:5000,sousTechnique:"Bois",tauxremise:0,taxes:900,technique:"Sculpture"},
   17:{artiste:"Kalidou KASSE",couleur:"Noir",dateAjout:"2018-06-25T13:45:00Z",description:"Sculpture bois 1",fraisLivraison:15000,id:17,idArtiste:4,idSousTechnique:1,idTechnique:1,nom:"Sculpture bois 1",nouveau:false,prix:10000,sousTechnique:"Bois",tauxremise:0,taxes:1800,technique:"Sculpture"}
  } ,
  selectedProductId: 0,
  selectedProduct:{},
  taxonomies: []
};


export function reducer(state = initialState, { type, payload }: any): ArticleState {
  switch (type) {

    case ArticleActions.GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        selectedProduct: payload
      }

    case ArticleActions.GET_ALL_PRODUCTS_SUCCESS:
      // //console.log('oeuvres : ' + payload.products);
      const _products: Oeuvre[] = payload.products;
      const productIds= _products.map(product => product.id);
      const productEntities = _products.reduce((products: { [id: number]: Oeuvre[] }, product: Oeuvre) => {
        return Object.assign(products, {
          [product.id]: product
        });
      }, {});
      return {
        ...state,
        productIds: productIds,
        productEntities: productEntities
      }

    case ArticleActions.GET_ALL_TAXONOMIES_SUCCESS:
      const _taxonomies= payload.taxonomies.taxonomies;
      return {
        ...state,
        taxonomies:payload.taxonomies.taxonomies
      };

    default: return state;
      // if (retrieveState()) {
      //   var newState = JSON.parse(localStorage.getItem('completeState'));
      //   return newState.articles;
      // } else {
      //   return state;
      // }
  }
};
