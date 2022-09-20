import { RouterModule } from '@angular/router';
import { AddressService } from './services/address.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './address.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddAddressComponent } from './add-address/add-address.component';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { DeliveryOptionsComponent } from './delivery-options/delivery-options.component';
import { MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatOptionModule, MatSlideToggleModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AddressComponent,
    AddAddressComponent,
    DeliveryAddressComponent,
    DeliveryOptionsComponent
  ],
  exports: [
    MatButtonModule,      
    MatMenuModule,      
    MatToolbarModule,      
    MatIconModule,      
    MatCardModule,            
    MatFormFieldModule,      
    MatInputModule,      
    MatDatepickerModule,      
    MatNativeDateModule,      
    MatRadioModule,      
    MatSelectModule,      
    MatOptionModule,      
    MatSlideToggleModule
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,      
    MatMenuModule,      
    MatToolbarModule,      
    MatIconModule,      
    MatCardModule,            
    MatFormFieldModule,      
    MatInputModule,      
    MatDatepickerModule,      
    MatNativeDateModule,      
    MatRadioModule,      
    MatSelectModule,      
    MatOptionModule,      
    MatSlideToggleModule
  ],
  providers: [
    AddressService,
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
export class AddressModule { }
