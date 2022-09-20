
/**
 * Read more about Immutable Records here
 * 1. https://coderwall.com/p/vxk_tg/using-immutable-js-in-typescript
 * 2. http://untangled.io/immutable-js-the-foolproof-guide-to-creating-lists/
 * 3. https://blog.jscrambler.com/immutable-data-immutable-js/
 * 4. https://medium.com/azendoo-team/immutable-record-react-redux-99f389ed676#.91s1g124s
 */

import { Map, Record, List } from 'immutable';
// import { Image } from '../../shared/modeles/image';
import { Taxonomy } from '../../shared/modeles/taxonomy';
import { Oeuvre } from '../../shared/modeles/oeuvre';
/*
export interface ArticleState extends Map<string, any> {
  productIds: List<number>;
  productEntities: Map<number, Oeuvre>;
  selectedProductId: number;
  selectedProduct: Oeuvre;
  taxonomies: List<Taxonomy>;
}

export const ArticleStateRecord = Record({
  productIds: List([]),
  productEntities: Map({}),
  selectedProductId: null,
  selectedProduct: Map({}),
  taxonomies: List([])
});
*/
export interface ArticleState{
  productIds: any;
  productEntities: any;
  selectedProductId: any;
  selectedProduct: Oeuvre;
  taxonomies: any;
}
