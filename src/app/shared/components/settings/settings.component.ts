import { Component, OnInit, Injectable, PLATFORM_ID, Inject, Input, ElementRef } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthServiceS } from '../../services/auth.service';
import { OeuvreService } from '../../services/oeuvre.service';
import { Oeuvre } from '../../modeles/oeuvre';
import { AppState } from '../../../interfaces';
import { AuthActions } from '../../../auth/actions/auth.actions';
import { getAuthStatus } from '../../../auth/reducers/selectors';
import { getTotalCartItems } from '../../../checkout/reducers/selectors';
import { environment } from '../../../../environments/environment';
import { getTotalWishlistItems } from '../../../wishlist/reducers/selectors';
import { LanguageService } from '../../services/language.service';


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
    codeCountryList: any[] = [];
    flagUrl: string = environment.flagCountry_url;
    currentLanguage = {
      name: 'Français',
      code: 'fr'
    };

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
  public oeuvres: Oeuvre[] = [];
  public newOeuvres: Oeuvre[] = [];
  
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
        private oeuvreS:OeuvreService,
        public languageService: LanguageService
        ) {
          setTimeout(() => {this.productService.cartItems.subscribe(response =>{ this.oeuvres = response;});}, 1000); 
            
          setTimeout(() => {this.productService.newCartItems.subscribe(response =>{ this.newOeuvres = response;});}, 500); // Skeleton Loader
    

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
    this.codeCountryList = this.languageService.languages;
    this.currentLanguage.code = localStorage.getItem("userLanguage")
    this.languageService.languages.forEach(l => {
      if(this.currentLanguage.code == 'GBR'){
        this.currentLanguage.name = 'English';
      } else if(this.currentLanguage.code == l.code){
        this.currentLanguage.name = l.name;
      }
    })
    // this.currentLanguage.code == 'GBR'? this.currentLanguage.name = 'English': 
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

  get getNewTotal(): Observable<number> {
    return this.productService.newCartTotalAmount();
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

  logout() {
    
    this.authService.signOut();
    this.removeList();
    this.router.navigate(['home/signart']);
    //location.replace();
    //this.redirectIfUserLoggedOut();
    //location.reload();
 }

 public removeList() {
  this.productService.removeList();
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
     //console.log("Changement sur le tchat");
     document.getElementById("tchatComp").focus();
   }

   getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

  changecode(code: string) {
    code == 'us' ? code = 'en' : code = code;
    localStorage.setItem("userLanguage", code);
    this.currentLanguage.code = code;
    //console.log(this.currentLanguage);
    //console.log(localStorage.getItem("userLanguage"))
    window.location.reload();
  }

}
