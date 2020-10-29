
import { ArticleActions } from '../actions/article-actions';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  switchMap,
  map
} from 'rxjs/operators';

// import { ProductDummyService } from './../../core/services/product-dummy.service';
import { Action } from '@ngrx/store';
import { ArticleService } from '../../shared/services/article.service';

@Injectable()
export class ArticleEffects {
  constructor(private actions$: Actions,
    private articleService: ArticleService,
    private productActions: ArticleActions) { }

  // tslint:disable-next-line:member-ordering
  @Effect()
  GetAllProducts$: Observable<Action> = this.actions$
    .pipe(
      ofType(ArticleActions.GET_ALL_PRODUCTS),
      switchMap((action: any) => this.articleService.getAllArticles()),
      map((data: any) => this.productActions.getAllProductsSuccess({ products: data })))
    ;

  @Effect()
  GetAllTaxonomies$: Observable<Action> = this.actions$
    .pipe(
      ofType(ArticleActions.GET_ALL_TAXONOMIES),
      switchMap((action: any) => this.articleService.getTaxonomies()),
      map((data: any) => this.productActions.getAllTaxonomiesSuccess({ taxonomies: data })));

  @Effect()
  GetProductDetail$: Observable<Action> = this.actions$
    .pipe(
      ofType(ArticleActions.GET_PRODUCT_DETAIL),
      switchMap((action: any) => this.articleService.getArticle(action.payload)),
      map((data: any) => this.productActions.getProductDetailSuccess(data)));
}
