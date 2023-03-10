import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";

//import { AppState } from 'src/app/interfaces';
import { Store } from '@ngrx/store';

import { Router } from '@angular/router';
//import { Panier } from 'src/app/shared/modeles/panier';
import { Subscription } from 'rxjs';
import { Oeuvre } from '../../../modeles/oeuvre';
import { environment } from '../../../../../environments/environment';
import { ImageDto } from '../../../modeles/image';
import { Client } from '../../../modeles/client';
import { AuthServiceS } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {

  @Input() product: Product;
  @Input() oeuvre: Oeuvre;
  @Input() currency: any = this.productService.Currency; // Default Currency 
  @Input() thumbnail: boolean = false; // Default False 
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  @Input() loader: boolean = false;


  actionsSubscription: Subscription;
  article$: Oeuvre = null;
  routeSubs: Subscription;
  articleId: number;
  oeuvreId: any;
  tab: Oeuvre[];
  url: any;
  private button: any;
  elmt: HTMLElement;
  listarticle: any = null;
 
  listeItems:any[];
  present: boolean;
  user: any;
  imageRes: ImageDto;
  isAdd: boolean;
  client: Client;
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  public ImageSrc : string
  public isFavorite:boolean;

  constructor(
    public productService: ProductService,
    private authService: AuthServiceS,
    private router:Router,
    private translate: TranslateService
    ) { 
      //const wishlistItem=JSON.parse(localStorage['wishlistItems'] || '[]');
      //console.log(this.oeuvre);
      //const result= wishlistItem.find(item => item.id === this.oeuvre.id)
      this.isAdd = true;
      this.user = this.authService.getUserConnected();
     
      //if(!result)
      //  this.isFavorite = false;
      //else
     //  this.isFavorite = true;
      
      if( this.user != null){
        if( this.user.userType === "ARTISTE"){
            this.isAdd = false;
          } else{
            this.client = this.authService.getClientConnected();
            ////console.log("client connect", this.client)
          }
      }
    }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; 
        const wishlistItem=JSON.parse(localStorage['wishlistItems'] || '[]');
        const result= wishlistItem.find(item => item.id === this.oeuvre.id)
        if(!result)
          this.isFavorite = false;
        else
          this.isFavorite = true;
      }, 1000); // Skeleton Loader
    }
  }

  // Get Product Color
  Color(variants) {
    const uniqColor = [];
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
    }
    return uniqColor
  }

  // Change Variants
  ChangeVariants(color, product) {
    product.variants.map((item) => {
      if (item.color === color) {
        product.images.map((img) => {
          if (img.image_id === item.image_id) {
            this.ImageSrc = img.src;
          }
        })
      }
    })
  }

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }


  addToCart(oeuvre: any) {
    
    this.user = this.authService.getUserConnected();
    if(this.user==null){
      /*Swal.fire({
        //title: 'Are you sure?',
        text: "Vous devez vous connecter pour effectuer cette action",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#376809',
        cancelButtonText: 'annuler',
        cancelButtonColor: '#601A17',
        confirmButtonText: 'Oui, se connecter'
      }).then((result) => {
        if (result.value) {
          //console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
          this.router.navigate(['/pages/login']);
        }
      })  */
      this.productService.addToCartNew(oeuvre);
     }else{
      this.productService.addToCart(oeuvre);
     }
  }
  

  addToWishlist(oeuvre: any) {
    this.user = this.authService.getUserConnected();
    if(this.user==null){
        this.translate.get('PopupConnexEffAction').subscribe(connexEff => {
          this.translate.get('confirmButtonText').subscribe(cbc => {
            this.translate.get('cancelButtonText').subscribe(cancelButtonText => {
              Swal.fire({
                title: connexEff,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: ' #f07c10',
                cancelButtonColor: '#d33',
                confirmButtonText: cbc,
                cancelButtonText: cancelButtonText
              }).then((result)=> {
                if (result.value) {
                  //console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
                  this.router.navigate(['/pages/login']);
                }
              });
            })
          })
        })
      // Swal.fire({
      //   //title: 'Are you sure?',
      //   text: "Vous devez vous connecter pour effectuer cette action",
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonColor: '#376809',
      //   cancelButtonColor: 'red',
      //   cancelButtonText: 'annuler',
      //   confirmButtonText: 'Oui, se connecter',
      //   reverseButtons: true,
      // }).then((result) => {
      //   if (result.value) {
      //     //console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
      //     this.router.navigate(['/pages/login']);
      //   }
      // }) 
     // this.isFavorite=this.productService.addToWishlist(oeuvre);
     }else{
      this.isFavorite=this.productService.addToWishlist(oeuvre);
     }
    
  }
  removeFromWishlist(oeuvre: any) {
    if(this.productService.removeWishlistItem(oeuvre))
      this.isFavorite=false;
  }

  addToCompare(oeuvre: any) {
    this.productService.addToCompare(oeuvre);
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }
}
