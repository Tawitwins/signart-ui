import { Component, OnInit } from '@angular/core';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.scss']
})
export class AbonnementComponent implements OnInit {
  public products: Product[] = [];
  constructor(public productService: ProductService) {
    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
    console.log('products', this.products);
  }

}
