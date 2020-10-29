
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';


import { Action } from '@ngrx/store';
import { ArticleService } from '../../shared/services/article.service';
import { FavoriteActions } from '../../wishlist/actions/favorite.actions';
import { WishItem } from '../../shared/modeles/wish_item';
import { Oeuvre } from '../../shared/modeles/oeuvre';
import {
  switchMap,
  map
} from 'rxjs/operators';
import { ofType } from '@ngrx/effects';

@Injectable()
export class FavoriteEffects {
  constructor(private actions$: Actions,
    private articleService: ArticleService,
    private favoriteActions: FavoriteActions) { }

  // tslint:disable-next-line:member-ordering

  @Effect()
  addToWishlist$: Observable<Action> = this.actions$
    .pipe(
      ofType(FavoriteActions.ADD_TO_WISHLIST),
      switchMap((action: any) => this.articleService.createNewWishItem(action.payload)),
      map((data: WishItem) => this.favoriteActions.addToWishlistSuccess(data)));

  @Effect()
  getAllWishlist$: Observable<Action> = this.actions$
    .pipe(
      ofType(FavoriteActions.GET_ALL_WISHLIST),
      switchMap((action: any) => this.articleService.getAllWishlist(action.payload)),
      map((data: Oeuvre[]) => this.favoriteActions.getAllWishlistSuccess(data)));
}
