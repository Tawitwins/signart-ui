import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Product } from '../classes/product';
import { Oeuvre } from '../modeles/oeuvre';
import { ArticleService } from './article.service';
import { ProductService } from './product.service';

@Injectable({
	providedIn: 'root'
})
export class Resolver implements Resolve<Product> {
  
  public product: Product = {};
  public oeuvre: Oeuvre;
  //public oeuvres: any;

  constructor(
    private router: Router,
    public productService: ProductService,
    private articleService: ArticleService,
    private http: HttpClient
  ) {
    //this.oeuvre = new Oeuvre();
  }

  // Resolver
  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 3000));   
   /* this.productService.getProductBySlug(route.params.slug).subscribe(product => {
      if(!product) { // When product is empty redirect 404
          this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
      } else {
          this.product = product
      }
    })*/

     this.productService.getOeuvreBySlug(route.params.id).subscribe(oeuvre => {
       console.log("oeuvre de resolver", oeuvre)
       console.log("params de resolver", route.params.id)
      if(!oeuvre) { // When product is empty redirect 404
          this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
      } else {
          this.oeuvre = oeuvre
      }
    })
    
  }

}
