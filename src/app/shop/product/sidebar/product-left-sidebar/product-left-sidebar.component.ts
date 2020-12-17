import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";

import Swal from 'sweetalert2';
import { Oeuvre } from '../../../../shared/modeles/oeuvre';
import { Artiste } from '../../../../shared/modeles/artiste';
import { AuthServiceS } from '../../../../shared/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { ArtisteService } from '../../../../shared/services/artiste.service';

declare var $: any;
@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {
 // @Input() loader: boolean = false;
  //public product: Product = {};
  public oeuvre: Oeuvre = {};
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public nbimages: number[];
  public loader: boolean = true;
  public artiste: Artiste;
  public name: string;
  public magnificationInt: number;
  user: any;

  @ViewChild("sizeChart") SizeChart: SizeModalComponent;
  
  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;
  isFavorite: any;

  constructor(private route: ActivatedRoute, private router: Router,
    public productService: ProductService, private artisteService: ArtisteService, private authService: AuthServiceS) { 
      this.nbimages = [1,2,3];
      this.route.params.subscribe(
        (params: any) => {
           // this.artisteId = params['id'];
            console.log("params de resolver", params['id'])
            this.productService.getOeuvreBySlug(params['id']).subscribe(oeuvre => {
              console.log("oeuvre de resolver", oeuvre)
              
             if(!oeuvre) { // When product is empty redirect 404
                 this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
             } else {
                 this.oeuvre = oeuvre
                 this.artisteService.getArtiste(this.oeuvre.idArtiste).subscribe(response => {
                  this.artiste = response;
                  console.log("artiste name",this.artiste)
                  this.name = this.artiste.prenom + " " + this.artiste.nom;
                });
             }
           })
          })
     
     /* 

      this.route.data.subscribe(response => {
        if(response.data != null){
          this.oeuvre = response.data
        }else{
          this.oeuvre = new Oeuvre();
        }
        });
      console.log("oeuvre dans left", this.oeuvre)*/
    }

    ngOnInit(): void {
      if(this.loader) {
        setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
      }
      (function ($) {
        $(document).ready(function(){
          console.log("Hello from jQuery!");
        });
      });
      /* $( "#imgOeuvr" ).on( "click", function() {
        alert( $( this ).text() );
      });
      $( "#imgOeuvr" ).trigger( "click" ); */

      $('.tile')
      // tile mouse actions
      .on('mouseover', function(){
        console.log("ici over mouse bro");
        $(this).children('.photo').css({'transform': 'scale('+ $(this).attr('data-scale') +')'});
      })
      .on('mouseout', function(){
        console.log("ici out mouse bro");
        $(this).children('.photo').css({'transform': 'scale(1)'});
      })
      .on('mousemove', function(e){
        console.log("ici move mouse bro");
        $(this).children('.photo').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
      })
      // tiles set up
      .each(function(){
        $(this)
          .children('.photo').css({'background-image': 'url('+ $(this).attr('src') +')'}); 
      }) 
    } 

    setMagnification(i){
      if(i==1)
        this.magnificationInt=2;
      else
        this.magnificationInt=1;
    }
  // Get Product Color
  Color(variants) {
    const uniqColor = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
    }
    return uniqColor
  }

  // Get Product Size
  Size(variants) {
    const uniqSize = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
        uniqSize.push(variants[i].size)
      }
    }
    return uniqSize
  }

  selectSize(size) {
    this.selectedSize = size;
  }
  
  // Increament
  increment() {
    this.counter++ ;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter-- ;
  }

  // Add to cart
  /*async addToCart(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if(status)
      this.router.navigate(['/shop/cart']);
  }*/

  async addToCart(oeuvre: any) {
    this.user = this.authService.getUserConnected();
    if(this.user==null){
      Swal.fire({
        //title: 'Are you sure?',
        text: "Vous devez vous connecter pour effectuer cette action",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#376809',
        cancelButtonColor: '#601A17',
        cancelButtonText: 'annuler',
        confirmButtonText: 'Oui, se connecter'
      }).then((result) => {
        if (result.value) {
          console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
          this.router.navigate(['/pages/login']);
        }
      })  
     }else{
    oeuvre.stock = this.counter || 1;
    const status = await this.productService.addToCart(oeuvre);
    if(status)
      this.router.navigate(['/shop/cart']);}
  }

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if(status)
      this.router.navigate(['/shop/checkout']);
  }
  addToWishlist(oeuvre: any) {
    this.user = this.authService.getUserConnected();
    if(this.user==null){
      Swal.fire({
        //title: 'Are you sure?',
        text: "Vous devez vous connecter pour effectuer cette action",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#376809',
        cancelButtonColor: '#601A17',
        cancelButtonText: 'annuler',
        confirmButtonText: 'Oui, se connecter'
      }).then((result) => {
        if (result.value) {
          console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
          this.router.navigate(['/pages/login']);
        }
      })  
     }else{
      this.isFavorite=this.productService.addToWishlist(oeuvre);
     }
    
  }
  

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

  getartisteName(id: number){
    

  }

  cancelContextMenu(){
    return false;
  }
}
