import { PaymentModule } from './payment/payment.module';
import { AddressModule } from './address/address.module';
import { CheckoutEffects } from './effects/checkout.effects';
import { EffectsModule } from '@ngrx/effects';
import { CheckoutActions } from './actions/checkout.actions';
import { CartModule } from './cart/cart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutRoutes as routes } from './checkout.routes';
import { SharedModule } from '../shared';
import { HttpService } from './shared/services/http';
//import { MyformatcurrencyPipe } from 'app/pipe/myformatcurrency.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    EffectsModule.forRoot([
      CheckoutEffects
    ]),
    CartModule,
    AddressModule,
    PaymentModule,
  ],
  declarations: [
    //MyformatcurrencyPipe
  ],
  providers: [
    CheckoutActions,
    HttpService
  ]
})
export class CheckoutModule { }
