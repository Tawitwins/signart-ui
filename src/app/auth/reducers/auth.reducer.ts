import { AuthActions } from '../actions/auth.actions';
import { AuthState, AuthStateRecord } from './auth.state';

export const initialState: AuthState = new AuthStateRecord() as unknown as AuthState;

export function reducer(state = initialState, { type, payload }: any): AuthState {
    switch (type) {
      case AuthActions.LOGIN_SUCCESS:
        return { isAuthenticated: true } as AuthState;

      case AuthActions.LOGOUT_SUCCESS:
        return { isAuthenticated: false } as AuthState;

      default: return state;
    }
  };
