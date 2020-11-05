import { Component, OnInit, Injectable, PLATFORM_ID, Inject, Input, ElementRef } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/actions/auth.actions';
import { AppState } from 'src/app/interfaces';
import { AuthServiceS } from '../../services/auth.service';
import { OeuvreService } from '../../services/oeuvre.service';
import { getAuthStatus } from 'src/app/auth/reducers/selectors';
import { getTotalCartItems } from 'src/app/checkout/reducers/selectors';
import { getTotalWishlistItems } from 'src/app/wishlist/reducers/selectors';
import { Oeuvre } from '../../modeles/oeuvre';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  technique:any;
    @Input() allmenus: any[];
    @Input() child:number[];
    //menus:any[];
    returnUrl:string;
    isAuthenticated: Observable<boolean>;
    totalCartItems: Observable<number>;
    totalWishlistItems:Observable<number>;
    favoris:any[];
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    openTchat:boolean=false;

    user: any;
    isAdd: boolean;

  //public products: Product[] = [];
  public oeuvres: Oeuvre[] = []
  
  public languages = [{ 
    name: 'English',
    code: 'en'
  }, {
    name: 'French',
    code: 'fr'
  }];

  public currencies = [{
    name: 'Euro',
    currency: 'EUR',
    price: 0.90 // price of euro
  }, {
    name: 'Rupees',
    currency: 'INR',
    price: 70.93 // price of inr
  }, {
    name: 'Pound',
    currency: 'GBP',
    price: 0.78 // price of euro
  }, {
    name: 'Dollar',
    currency: 'USD',
    price: 1 // price of usd
  }]

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    public productService: ProductService,
    location: Location, 
        private element: ElementRef, 
        private router: Router,
        private route:ActivatedRoute,
         private authService: AuthServiceS,
        private store: Store<AppState>,
        private authActions: AuthActions,
        private oeuvreS:OeuvreService) {
    this.productService.cartItems.subscribe(response => this.oeuvres = response);

    this.isAdd = true;
        this.user = this.authService.getUserConnected();
        if( this.user != null){
            if( this.user.userType === "ARTISTE"){
                this.isAdd = false;
                 }
        }else{
            this.isAdd = false;
        }
           

        this.location = location;
        this.sidebarVisible = false;
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
   // this.redirectIfUserLoggedOut();
    this.store.dispatch(this.authActions.authorize());
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
    this.totalWishlistItems = this.store.select(getTotalWishlistItems);
    //this.listTitles = this.menus.filter(listTitle => listTitle);

    const navbar: HTMLElement = this.element.nativeElement;

  }

  changeLanguage(code){
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
    }
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

  logout() {
    this.authService.signOut();
    this.redirectIfUserLoggedOut();
    location.reload();
 }
 redirectIfUserLoggedOut(){
     this.store.select(getAuthStatus).subscribe(
       data => {
         if (data === false) {
         this.router.navigate(['home/signart']);
        }
       }
     );
   }
   openForm(){
     this.openTchat=true;
     document.getElementById("myForm").style.display = "block";
   }
   closeForm(){
     //this.openTchat=false;
     document.getElementById("myForm").style.display = "none";
   }
   reloadTchatComp(){
     console.log("Changement sur le tchat");
     document.getElementById("tchatComp").focus();
   }

   getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }



}
