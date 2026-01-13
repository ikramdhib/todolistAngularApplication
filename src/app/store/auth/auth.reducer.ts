import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  
  on(AuthActions.login, (state, { email }) => ({
    ...state,
    currentUserEmail: email,
    isAuthenticated: true
  })),
  
  on(AuthActions.logout, () => initialAuthState)
);