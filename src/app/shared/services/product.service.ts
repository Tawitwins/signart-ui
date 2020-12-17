import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { ArticleService } from '../services/article.service'
import { Oeuvre } from '../modeles/oeuvre';
//import { environment } from 'src/environments/environment';
//import { CheckoutActions } from 'src/app/checkout/actions/checkout.actions';
import { CheckoutService } from './checkout.service';
import { Panier } from '../modeles/panier';
import { Store } from '@ngrx/store';
//import { AppState } from 'src/app/interfaces';
import { Client } from '../modeles/client';
import { AuthServiceS } from './auth.service';
import { CheckoutActions } from '../../checkout/actions/checkout.actions';
import { AppState } from '../../interfaces';
import { environment } from '../../../environments/environment';
import { PanierEtMarquageService } from './panierEtMarquage.service';
import { LignePanier } from '../modeles/ligne_panier';
import { OeuvreNumerique } from '../modeles/imageNumerique';
import { WishItem } from '../modeles/wish_item';

var state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  compare: JSON.parse(localStorage['compareItems'] || '[]'),
  cart: JSON.parse(localStorage['cartItems'] || '[]')
}

const stateList = {
  oeuvresNumeriques: JSON.parse(localStorage['oeuvresNumeriques'] || '[]'),
 // wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  comparelist: JSON.parse(localStorage['compareListItems'] || '[]'),
  list: JSON.parse(localStorage['listItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public Currency = { name: 'FCFA', currency: 'XOF', price: 1 } // Default Currency
  public OpenCart: boolean = false;
  public Products: any;
  public Oeuvres: any;
  public oeuvs: Oeuvre[];
  public panier: Panier;
  public client: Client=new Client("",0,0,new Date(),"","",0,"","","","","",0,"");

  constructor(private http: HttpClient,private newCheckoutService:CheckoutService,
    private toastrService: ToastrService, private articleService: ArticleService,
    private checkoutActions: CheckoutActions, private panierEtMarquateService:PanierEtMarquageService,
    private checkoutService: CheckoutService,private store: Store<AppState>,  private authService: AuthServiceS,) { }

  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */

 initState(){
   console.log("ca kass un peu les pied quand meme");
   state.cart =JSON.parse(localStorage['cartItems'] || '[]');
   state.wishlist= JSON.parse(localStorage['wishlistItems'] || '[]');
 }
  // Product
  private get products(): Observable<Product[]> {

    this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
    this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }

  getCommandeOfClient(idClient: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `commande/client/${idClient}`);
  }

  private get oeuvres(): Observable<Oeuvre[]> {
    this.Oeuvres = this.http.get(environment.API_ENDPOINT + `oeuvre`);
   // this.articleService.getAllArticles().subscribe(response => { 
    //  this.Oeuvres = response;
      this.Oeuvres.pipe(map(data => data));
     // this.Oeuvres.subscribe(next => { localStorage['oeuvres'] = JSON.stringify(next) });
     // console.log("oeuvres product service", this.oeuvres)
    //        });
    return this.Oeuvres;// = this.Oeuvres.pipe(startWith(JSON.parse(localStorage['oeuvres'] || '[]')));
  }

  // Get Products
  public get getProducts(): Observable<Product[]> {
    return this.products;
  }

  public get getOeuvres(): Observable<Oeuvre[]> {
    return this.oeuvres;
  }

 


  // Get Products By Slug
  public getProductBySlug(slug: string): Observable<Product> {
    return this.products.pipe(map(items => { 
      return items.find((item: any) => { 
        return item.title.replace(' ', '-') === slug; 
      }); 
    }));
  }


  public getOeuvreBySlug(id: number): Observable<Oeuvre> {
    console.log("oeuvres dans product service", this.oeuvres)
    return this.oeuvres.pipe(map(oeuves => { 
      console.log("items dans product service", oeuves)
      return oeuves.find((oeuve: Oeuvre) => { 
        return oeuve.id == id; 
      }); 
    }));
  }

  public findOeuvreBySlug(slug: string): Oeuvre {
    console.log("oeuvres dans product service", this.oeuvres)
    let unoeuvre: Oeuvre;
    this.articleService.getAllArticles().subscribe(response => { 
      this.oeuvs = response;
      for (let i = 0; i < this.oeuvs.length; i++) {
        if(this.oeuvs[i].nom.replace(' ', '-') == slug)
           unoeuvre = this.oeuvs[i];
           break;   
      }
      
    });
    return unoeuvre;
  }


  /*
    ---------------------------------------------
    ---------------  Favoris  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Ajouter aux Favoris
  public addToWishlist(product): any {
    product.image=null;
    const wishlistItem = state.wishlist.find(item => item.id === product.id)
    if (!wishlistItem) {
      state.wishlist.push({
        ...product
      })
      let wishedItem = new WishItem();
      wishedItem.idClient=JSON.parse(localStorage.getItem('client')).id;
      wishedItem.idOeuvre=product.id;
      wishedItem.codeTypeMarquage= environment.MarquageFavori;
      wishedItem.dateMarquage= new Date();
    
      this.panierEtMarquateService.postWishlistItem(wishedItem).subscribe(resp=>{
        console.log(resp);
      });
    }
    else{
      return false;
    }
    this.toastrService.success("L'oeuvre a été ajoutée dans vos favoris.");
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }

  // Supprimer les favoris
  public removeWishlistItem(product: Product): any {
    const index = state.wishlist.indexOf(product);
    state.wishlist.splice(index, 1);
    let client =  this.authService. getClientConnected();
    if(client!=null)
    {
      this.panierEtMarquateService.deleteWishlistItem(product.id,client.id,environment.MarquageFavori).subscribe(resp=>{
        console.log(resp);
      });
    }
    this.toastrService.success("L'oeuvre a été retirée de vos favoris.");
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  // Get Compare Items
  public get compareItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.compare);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Compare
  public addToCompare(product): any {
    const compareItem = state.compare.find(item => item.id === product.id)
    if (!compareItem) {
      state.compare.push({
        ...product
      })
    }
    this.toastrService.success("L'oeuvre a été ajoutée pour une comparaison.");
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  // Remove Compare items
  public removeCompareItem(product: Product): any {
    const index = state.compare.indexOf(product);
    state.compare.splice(index, 1);
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  // Get Cart Items
  public get cartItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.cart);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  public get listItems(): Observable<OeuvreNumerique[]> {
    const itemsStream = new Observable(observer => {
      observer.next(stateList.list);
      observer.complete();
    });
    return <Observable<OeuvreNumerique[]>>itemsStream;
  }

  // Add to Cart
  /*public addToCart(product): any {
    const cartItem = state.cart.find(item => item.id === product.id);
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;
    const stock = this.calculateStockCounts(items, qty);
    
    if(!stock) return false

    if (cartItem) {
        cartItem.quantity += qty    
    } else {
      state.cart.push({
        ...product,
        quantity: qty
      })
    }

    this.OpenCart = true; // If we use cart variation modal
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }*/

  public addToCart(oeuvre: Oeuvre): any {
    let User=this.authService.getUserConnected();
    if(User.userType=="CLIENT")
    {
      oeuvre.image=null;
      const cartItem = state.cart.find(item => item.id === oeuvre.id);
      const qty = 1;// oeuvre.stock ? oeuvre.stock : 1;
      const items = cartItem ? cartItem : oeuvre;
      const stock = this.calculateStockCounts(items, qty);
      this.client = this.authService.getClientConnected();
      console.log("client", this.client)
      console.log("oeuvre", oeuvre)
      
      if(!stock) return false
  
      if (cartItem) {
          cartItem.quantity += qty    
      } else {
        state.cart.push({
          ...oeuvre,
          quantity: qty
        })
      }
  
      this.newCheckoutService.createNewLineItemInLocalStorage(oeuvre,this.client.id);
      this.panierEtMarquateService.createNewLineItem(oeuvre).subscribe(resp=>{
        if(resp.id!=null)
        {
          this.OpenCart = true; // If we use cart variation modal
          localStorage.setItem("cartItems", JSON.stringify(state.cart));
          return true;
        }
        else{
          return false;
        }
      })
    }
    else{
      this.toastrService.info("Seuls les clients peuvent faire des achats et utiliser le panier!","Attention !!");
      return false;
    }
    
  }

  public addToList(oeuvreNumerique: OeuvreNumerique): any {
    console.log("show item added", oeuvreNumerique)
    
    const listItem = stateList.list.find(item => item.id === oeuvreNumerique.id);
    const qty = 1;// oeuvre.stock ? oeuvre.stock : 1;
    const items = listItem ? listItem : oeuvreNumerique;
    //const stock = this.calculateStockCounts(items, qty);
    this.client = this.authService.getClientConnected();
   /* console.log("client", this.client)
    console.log("oeuvre", oeuvre)*/
    
    //if(!stock) return false

    if (listItem) {
      listItem.quantity += qty    
    } else {
      oeuvreNumerique.avatar=null;
      stateList.list.push({
        ...oeuvreNumerique,
        quantity: qty
      })
    }

    //this.OpenCart = true; // If we use cart variation modal
    this.toastrService.success('Oeuvre ajoutée à la liste!');
    localStorage.setItem("listItems", JSON.stringify(stateList.list));
    return true;
   
  }

  public addToCartOeuvre(oeuvre:Oeuvre): any {
    oeuvre.quantity=1;
    let User=this.authService.getUserConnected();
    if(User.userType=="CLIENT")
    {
      const cartItem = state.cart.find(item => item.id === oeuvre.id);
      const qty = 1; //oeuvre.stock ? oeuvre.stock : 1;
      const items = cartItem ? cartItem : oeuvre;
      const stock = this.calculateStockCounts(items, qty);
      
      if(!stock) return false

      if (cartItem) {
        this.updateCartQuantity(cartItem,+1);    
      } else {
        state.cart.push({
          ...oeuvre,
          //stock: qty
        })
      }

      this.newCheckoutService.createNewLineItemInLocalStorage(oeuvre,this.client.id);
      this.panierEtMarquateService.createNewLineItem(oeuvre).subscribe(resp=>{
        if(resp.id!=null)
        {
          this.OpenCart = true; // If we use cart variation modal
          localStorage.setItem("cartItems", JSON.stringify(state.cart));
          return true;
        }
        else{
          return false;
        }
      })
    }
    else{
      this.toastrService.info("Seuls les clients peuvent faire des achats et utiliser le panier!","Attention !!");
      return false;
    }
    
  }

  // Update Cart Quantity
  public updateCartQuantity(product: Product, quantity: number): Product | boolean {
    return state.cart.find((items, index) => {
      if (items.id === product.id) {
        const qty = state.cart[index].quantity + quantity
        const stock = this.calculateStockCounts(state.cart[index], quantity)
        if (qty !== 0 && stock) {
          state.cart[index].quantity = qty
          this.newCheckoutService.createNewLineItemInLocalStorage(product,this.client.id);
          localStorage.setItem("cartItems", JSON.stringify(state.cart));
          this.client = this.authService.getClientConnected();
          console.log(this.client);
          this.panierEtMarquateService.getLineItemsByClient(this.client.id).subscribe(resp=>{
            let lignePaniers = <LignePanier[]> resp;
            console.log(lignePaniers); 
            let lp=lignePaniers.find(lp=>lp.oeuvre.id===product.id);
            console.log(lp);
            if(lp!=null || lp != undefined)
            {
              console.log(lignePaniers);
              console.log(lp);
              lp.quantite=state.cart[index].quantity;
              lp.oeuvre.image=null;
              lp.idClient=this.client.id;
              this.panierEtMarquateService.updateLigneItems(lp).subscribe(resp=> console.log(resp));
            }
          })
        }
        return true
      }
    })
  }

    // Calculate Stock Counts
  /*public calculateStockCounts(product, quantity) {
    const qty = product.quantity + quantity
    const stock = product.stock
    if (stock < qty || stock == 0) {
      this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
      return false
    }
    return true
  }*/

  public calculateStockCounts(oeuvre, quantity) {
    const qty = oeuvre.quantity + quantity
    const stock = oeuvre.stock
    if (stock < qty || stock == 0) {
      this.toastrService.error('Oeuvre déja dans le panier. '+ stock +' article(s) restant(s).');
      return false
    }
    return true
  }

  // Remove Cart items
  public removeCartItem(product: Product): any {
    const index = state.cart.indexOf(product);
    state.cart.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    this.client = this.authService.getClientConnected();
        console.log(this.client);
        this.panierEtMarquateService.getLineItemsByClient(this.client.id).subscribe(resp=>{
          let lignePaniers = <LignePanier[]> resp;
          console.log(lignePaniers); 
          let lp=lignePaniers.find(lp=>lp.oeuvre.id===product.id);
          console.log(lp);
          if(lp!=null || lp != undefined)
          {
            this.panierEtMarquateService.deleteLineItem(lp).subscribe(resp=> console.log(resp));
          }
        })
    return true
  }
 
   // Remove Cart items
   public removeListItem(oeuvreNumerique: OeuvreNumerique): any {
    const index = stateList.list.indexOf(oeuvreNumerique);
    stateList.list.splice(index, 1);
    this.toastrService.warning('Oeuvre retirée de la liste!');
    localStorage.setItem("listItems", JSON.stringify(stateList.list));
    
    return true
  }

  public checkItemList(): any {
    let index = 0;
    //index = stateList.list.indexOf(oeuvreNumerique);
    return stateList.list;
    console.log("indexxxxxx checkkkkk", stateList.list)
   /* if(index == -1){
      return false;
    }else{
      return true;
    }*/

  }

  public removeList(): any {
    stateList.list = [];
    localStorage.setItem("listItems", JSON.stringify(stateList.list));
    
    return true
  }


  // Total amount 
 /* public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((product: Product[]) => {
      return product.reduce((prev, curr: Product) => {
        let price = curr.price;
        if(curr.discount) {
          price = curr.price - (curr.price * curr.discount / 100)
        }
        return (prev + price * curr.quantity) * this.Currency.price;
      }, 0);
    }));
  }*/

  public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((oeuvre: Oeuvre[]) => {
      return oeuvre.reduce((prev, curr: Oeuvre) => {
        let price = curr.prix;
        if(curr.tauxremise) {
          price = curr.prix - (curr.prix * curr.tauxremise / 100)
        }
        return (prev + price * curr.quantity) * this.Currency.price;
      }, 0);
    }));
  }

  public listTotalAmount(): Observable<number> {
    return this.listItems.pipe(map((oeuvre: OeuvreNumerique[]) => {
      return oeuvre.reduce((prev, curr: OeuvreNumerique) => {
        let price = curr.tarif;
        return (prev + price) * this.Currency.price;
      }, 0);
    }));
  }

  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */

  // Get Product Filter
  public filterProducts(filter: any): Observable<Product[]> {
    return this.products.pipe(map(product => 
      product.filter((item: Product) => {
        if (!filter.length) return true
        const Tags = filter.some((prev) => { // Match Tags
          if (item.tags) {
            if (item.tags.includes(prev)) {
              return prev
            }
          }
        })
        return Tags
      })
    ));
  }

  public filterOeuvre(filter: any): Observable<Oeuvre[]> {
    return this.oeuvres.pipe(map(oeuvre => 
      oeuvre.filter((item: Oeuvre) => {
        if (!filter.length) return true
        const Tags = filter.some((prev) => { // Match Tags
          if (item.nom) {
            if (item.nom.includes(prev)) {
              return prev
            }
          }
        })
        return Tags
      })
    ));
  }

 

  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {

    if(payload === 'ascending') {
      return products.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.title > b.title) {
          return -1;
        } else if (a.title < b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else if (a.price > b.price) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        } else if (a.price < b.price) {
          return 1;
        }
        return 0;
      })
    } 
  }

  public sortOeuvres(oeuvres: Oeuvre[], payload: string): any {

    if(payload === 'ascending') {
      return oeuvres.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return oeuvres.sort((a, b) => {
        if (a.nom < b.nom) {
          return -1;
        } else if (a.nom > b.nom) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return oeuvres.sort((a, b) => {
        if (a.nom > b.nom) {
          return -1;
        } else if (a.nom < b.nom) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return oeuvres.sort((a, b) => {
        if (a.prix < b.prix) {
          return -1;
        } else if (a.prix > b.prix) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return oeuvres.sort((a, b) => {
        if (a.prix > b.prix) {
          return -1;
        } else if (a.prix < b.prix) {
          return 1;
        }
        return 0;
      })
    } 
    else if (payload === 'ancien') {
      return oeuvres.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        } else if (a.id < b.id) {
          return 1;
        }
        return 0;
      })
    } 
    else if (payload === 'recent') {
      return oeuvres.sort((a, b) => {
        if (b.id > a.id) {
          return -1;
        } else if (b.id < a.id) {
          return 1;
        }
        return 0;
      })
    } 
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) { 
      currentPage = 1; 
    } else if (currentPage > totalPages) { 
      currentPage = totalPages; 
    }
    
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if(currentPage < paginateRange - 1){
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage =  currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

}
