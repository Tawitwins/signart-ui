import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { Oeuvre } from '../../shared/modeles/oeuvre';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { CheckoutService } from '../../shared/services/checkout.service';
import { AuthServiceS } from '../../shared/services/auth.service';
import { User } from '../../shared/modeles/user';
import { ToastrService } from 'ngx-toastr';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { tap } from 'rxjs/operators';
import { Client } from '../../shared/modeles/client';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  //public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];
  user: User;
  client: Client |any;
  data: any;

  constructor(public productService: ProductService,private toastrService:ToastrService,private oeuvreS: OeuvreService,private toastr:ToastrService,private authS:AuthServiceS,private newCheckoutService:CheckoutService,private router:Router) {
    //this.productService.cartItems.subscribe(response => this.products = response);
    this.productService.cartItems.subscribe(response => this.oeuvres = response);
    this.user = this.authS.getUserConnected();
    console.log(this.oeuvres);
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
  confirmer()
  {
    if (this.user === null) {
      this.router.navigate(['/auth', 'account']);
      this.toastr.info("Vous devez vous authentifier avant la commande!","Redirection");
    }
     else {
      this.oeuvreS.getClientByUser(this.user.id)
        .subscribe(
          response => {
            this.client = <Client>response;
            localStorage.setItem('client',JSON.stringify(response));
            let order =JSON.parse(localStorage.getItem('order'));
            console.log(order)
            if (order === null) {
              this.data = JSON.parse(localStorage.getItem('panier'));
              this.newCheckoutService.createOrder(this.client.id, this.data).pipe(
                tap(() => {
                  this.toastrService.success("Commande bien pris en compte, veuillez compléter les étapes restantes!","Succès");
                  this.router.navigate(['/shop/checkout']);
                  //localStorage.removeItem('panier');
                }))
                .subscribe();
            } else {
              this.router.navigate(['/shop/checkout']);
            }
          });
    }
  }

}
