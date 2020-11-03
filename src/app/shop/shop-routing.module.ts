import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';

import { Resolver } from '../shared/services/resolver.service';

const routes: Routes = [
  {
    path: 'product/left/sidebar/:id',
    component: ProductLeftSidebarComponent,
    /*resolve: {
      data: Resolver
    }*/
  },
  
  {
    path: 'collection/left/sidebar',
    component: CollectionLeftSidebarComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'checkout/success/:id',
    component: SuccessComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
