import { AuthState } from './auth/reducers/auth.state';
// import { UserState } from './user/reducers/user.state';
import { CheckoutState } from './checkout/reducers/checkout.state';
import { ArticleState } from './detail-article/reducers/article-state';
import { FavoriteState } from './wishlist/reducers/favorite.state';
// import { SearchState } from './home/reducers/search.state';

// This should hold the AppState interface
// Ideally importing all the substate for the application

/**
 *
 *
 * @export
 * @interface AppState
 */
export interface AppState {
  articles: ArticleState;
  auth: AuthState;
  checkout: CheckoutState;
  favorite: FavoriteState;
  // users: UserState;
}
