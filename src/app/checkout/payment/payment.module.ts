import { PaymentService } from './services/payment.service';
import { PaymentComponent } from './payment.component';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentModesListComponent } from './payment-modes-list/payment-modes-list.component';
import { PaymentModeComponent } from './payment-modes-list/payment-mode/payment-mode.component';
import { CreditCardComponent } from './payment-modes-list/credit-card/credit-card.component';
import { NetBankingComponent } from './payment-modes-list/net-banking/net-banking.component';
import { CashOnDeliveryComponent } from './payment-modes-list/cash-on-delivery/cash-on-delivery.component';
import { PaypalComponent } from './payment-modes-list/paypal/paypal.component';
import { LigneCommandeComponent } from './ligne-commande/ligne-commande.component';
import { PaydunyaComponent } from './payment-modes-list/paydunya/paydunya.component';
//import { MyformatcurrencyPipe } from 'app/pipe/myformatcurrency.pipe';
@NgModule({
  declarations: [
    PaymentComponent,
    PaymentModesListComponent,
    PaymentModeComponent,
    CreditCardComponent,
    NetBankingComponent,
    CashOnDeliveryComponent,
    PaypalComponent,
    LigneCommandeComponent,
    PaydunyaComponent,
    //MyformatcurrencyPipe
  ],
  exports: [],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    PaymentService,
    ]
})
export class PaymentModule { }
