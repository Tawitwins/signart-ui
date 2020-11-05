import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { Oeuvre } from 'src/app/shared/modeles/oeuvre';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  //public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];

  constructor(public productService: ProductService) {
    //this.productService.cartItems.subscribe(response => this.products = response);
    this.productService.cartItems.subscribe(response => this.oeuvres = response);
  }

  ngOnInit(): void {
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Increament
  increment(oeuvre, qty = 1) {
    this.productService.updateCartQuantity(oeuvre, qty);
  }

  // Decrement
  decrement(oeuvre, qty = -1) {
    this.productService.updateCartQuantity(oeuvre, qty);
  }

  public removeItem(oeuvre: any) {
    this.productService.removeCartItem(oeuvre);
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

}
