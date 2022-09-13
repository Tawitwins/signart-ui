import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPayPalModule } from 'ngx-paypal';
import { Ng5SliderModule } from 'ng5-slider';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';

// Product Details Components
import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';

// Product Details Widgest Components
import { ServicesComponent } from './product/widgets/services/services.component';
import { CountdownComponent } from './product/widgets/countdown/countdown.component';
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';
import { RelatedProductComponent } from './product/widgets/related-product/related-product.component';

// Collection Components
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';

// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { BrandsComponent } from './collection/widgets/brands/brands.component';
import { ColorsComponent } from './collection/widgets/colors/colors.component';
import { SizeComponent } from './collection/widgets/size/size.component';
import { PriceComponent } from './collection/widgets/price/price.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule, POSITION, SPINNER } from 'ngx-ui-loader';

import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';
import { AbonnementCatalogueComponent } from './collection/abonnement-catalogue/abonnement-catalogue.component';
import { PaydunyaComponent } from '../checkout/payment/payment-modes-list/paydunya/paydunya.component';
import { PaypalComponent } from '../checkout/payment/payment-modes-list/paypal/paypal.component';
import { CashOnDeliveryComponent } from '../checkout/payment/payment-modes-list/cash-on-delivery/cash-on-delivery.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AddAddressComponent } from '../checkout/address/add-address/add-address.component';
/*const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'rgba(12,80,219,0.98)',
  bgsOpacity: 1,
  bgsPosition: POSITION.bottomRight,
  bgsSize: 40,
  bgsType: SPINNER.,
  fgsColor: 'rgba(12,80,219,0.98)',
  fgsPosition: POSITION.centerCenter,
  logoUrl: "src/assets/images/logo_signart.png"
  };*/

@NgModule({
  declarations: [
    ProductLeftSidebarComponent, 
    ServicesComponent,
    CountdownComponent,
    SocialComponent,
    StockInventoryComponent,
    RelatedProductComponent,
    CollectionLeftSidebarComponent,
    AbonnementCatalogueComponent,
    GridComponent,
    PaginationComponent,
    BrandsComponent,
    ColorsComponent,
    SizeComponent,
    PriceComponent,
    CartComponent,
    WishlistComponent,
    CheckoutComponent,
    SuccessComponent,
    PaydunyaComponent,
    PaypalComponent,
    /* PaymentModeComponent,
    NetBankingComponent,
    CreditCardComponent, */
    CashOnDeliveryComponent,
  ],
  imports: [
    CommonModule,
    NgxPayPalModule,
    Ng5SliderModule,
    SharedModule,
    ShopRoutingModule,
    NgxUiLoaderModule,
    NgxImageZoomModule,
  ],
  exports:[
    PaydunyaComponent
  ]
})
export class ShopModule { }
