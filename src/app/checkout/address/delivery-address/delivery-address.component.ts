import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../../../shared/modeles/address';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})
export class DeliveryAddressComponent implements OnInit {

  @Input() address: Address;

  constructor() {}

  ngOnInit() {
  }

}
