import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  oeuvres:any;
  constructor(private productService: ProductService,) { 
    this.productService.wishlistItems.subscribe(resp=> this.oeuvres=resp);
    console.log(this.oeuvres);
  }

  ngOnInit(): void {
  }

  addOeuvreToCart(element){
    console.log(element);
    this.productService.addToCartOeuvre(element);
  }
  removeOeuvre(element){
    console.log(element);
    this.productService.removeWishlistItem(element);
  }
  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }
}
