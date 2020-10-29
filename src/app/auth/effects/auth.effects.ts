import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { Action } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
import { Observable } from 'rxjs';
import { AuthServiceS } from '../../shared/services/auth.service';
import {
  switchMap,
  map,
  filter
} from 'rxjs/operators';
import { ofType } from '@ngrx/effects';

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthServiceS,
    private authActions: AuthActions
  ) { }

  @Effect()
  Authorized$: Observable<Action> = this.actions$
    .pipe(
      ofType(AuthActions.AUTHORIZE),
      switchMap(() => this.authService.authorized()),
      filter((data) => !data.error && data.count),
      map(() => this.authActions.loginSuccess())
      );
}
