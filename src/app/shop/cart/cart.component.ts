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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  //public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];
  public newOeuvres: Oeuvre[] = [];
  user: User;
  client: Client |any;
  data: any;
  public isConnected: boolean;

  constructor(public productService: ProductService,private toastrService:ToastrService,private oeuvreS: OeuvreService,private toastr:ToastrService,private authS:AuthServiceS,private newCheckoutService:CheckoutService,private router:Router) {
    //this.productService.cartItems.subscribe(response => this.products = response);
    this.isConnected = false;
    this.productService.cartItems.subscribe(response => this.oeuvres = response);
    this.productService.newCartItems.subscribe(response => this.newOeuvres = response);
    this.user = this.authS.getUserConnected();
    console.log("userrrrrrrrrr",this.user)
    
    if(this.user != null){
      this.isConnected = true;
    }
    console.log("newwwwww oeuvressssssss",this.newOeuvres);
  }

  ngOnInit(): void {
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  public get getNewTotal(): Observable<number> {
    return this.productService.newCartTotalAmount();
  }

  // Increament
  increment(oeuvre, qty = 1) {
    this.productService.updateCartQuantity(oeuvre, qty);
  }

  incrementNew(oeuvre, qty = 1) {
    this.productService.updateNewCartQuantity(oeuvre, qty);
  }

  // Decrement
  decrement(oeuvre, qty = -1) {
    this.productService.updateCartQuantity(oeuvre, qty);
  }

  decrementNew(oeuvre, qty = -1) {
    this.productService.updateNewCartQuantity(oeuvre, qty);
  }

  public removeItem(oeuvre: any) {
    this.productService.removeCartItem(oeuvre);
  }

  public removeNewItem(oeuvre: any) {
    this.productService.removeNewCartItem(oeuvre);
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }
  confirmer()
  {
    if (this.user === null) {
     // this.router.navigate(['/auth', 'account']);
        Swal.fire({
        //title: 'Are you sure?',
        text: "Vous devez vous connecter pour effectuer cette action",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#376809',
        cancelButtonColor: 'red',
        cancelButtonText: 'annuler',
        confirmButtonText: 'Oui, se connecter',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
          this.router.navigate(['/pages/login']);
        }
      })
     // this.toastr.info("Vous devez vous authentifier avant la commande!","Redirection");
    }
     else {
      this.oeuvreS.getClientByUser(this.user.id)
        .subscribe(
          response => {
            this.client = <Client>response;
            localStorage.setItem('client',JSON.stringify(response));
            let order =JSON.parse(localStorage.getItem('order'));
            console.log(order)
            //if (order === null) {
              this.data = JSON.parse(localStorage.getItem('panier'));
              this.newCheckoutService.createOrder(this.client.id, this.data).pipe(
                tap(() => {
                  this.toastrService.success("Commande bien prise en compte, veuillez compléter les étapes restantes!","Succès");
                  this.router.navigate(['/shop/checkout']);
                  //localStorage.removeItem('panier');
                }))
                .subscribe();
            //} else {
              //this.router.navigate(['/shop/checkout']);
            //}
          });
    }
  }

}
