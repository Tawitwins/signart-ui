import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";

//import { AppState } from 'src/app/interfaces';
import { Store } from '@ngrx/store';

import { ActivatedRoute, Router } from '@angular/router';
//import { Panier } from 'src/app/shared/modeles/panier';
import { Subscription } from 'rxjs';
import { Oeuvre } from '../../../modeles/oeuvre';
import { environment } from '../../../../../environments/environment';
import { ImageDto } from '../../../modeles/image';
import { Client } from '../../../modeles/client';
import { AuthServiceS } from '../../../services/auth.service';
import { ArtisteService } from 'src/app/shared/services/artiste.service';
import { Artiste } from 'src/app/shared/modeles/artiste';
import { OeuvreNumerique } from 'src/app/shared/modeles/imageNumerique';
import { Technique } from 'src/app/shared/modeles/technique';
import { ListSelection } from 'src/app/shared/modeles/utilisateur';
import { ImageService } from 'src/app/shared/services/image.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'oeuvre-numerique-box-one',
  templateUrl: './oeuvre-numerique-box-one.component.html',
  styleUrls: ['./oeuvre-numerique-box-one.component.scss']
})
export class OeuvreNumeriqueBoxOneComponent implements OnInit {

  

  @Input() product: Product;
  @Input() oeuvre: Oeuvre;
  @Input() oeuvreNumerique: OeuvreNumerique;
  @Input() currency: any = this.productService.Currency; // Default Currency 
  @Input() thumbnail: boolean = false; // Default False 
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  @Input() loader: boolean = false;


  actionsSubscription: Subscription;
  urlimg: any;
  private base64Image: string;
  article$: Oeuvre = null;
  routeSubs: Subscription;
  articleId: number;
  oeuvreId: any;
  tab: Oeuvre[];
  public oeuvreNumeriqueSave: OeuvreNumerique;
  url: any;
  private button: any;
  elmt: HTMLElement;
  listarticle: any = null;
  artistes: Artiste[];
  auteur: Artiste[];
  annee: any[];
  techniques: Technique[];
  listeSelection: ListSelection;
  allYears: number[];
  artisteName: string;
  
  listeItems:any[];
  present: boolean;
  user: any;
  minYears: number;
  maxYears: number;
  //imageRes: ImageDto;
  imageRes: OeuvreNumerique[];
  imageRes2: OeuvreNumerique[];
  imageFiltres: OeuvreNumerique[];
  isAdd: boolean;
  client: Client;
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  public ImageSrc : string

  constructor(private productService: ProductService,
    private authService: AuthServiceS,
    private router:Router,
    private artisteService: ArtisteService, private imageService: ImageService,
    public domSanitizer: DomSanitizer, private route: ActivatedRoute) { 


      this.actionsSubscription = this.route.params.subscribe(
        (params: any) => {
          this.articleId = params['id'];});
      
      this.isAdd = true;
      this.artistes = [];
      this.allYears = [];
      this.oeuvreNumeriqueSave = new OeuvreNumerique(null,'','',null,null,'',null,'',null,null,'',null,null);
      this.user = this.authService.getUserConnected();
      
     
     
      
      if( this.user != null){
        if( this.user.userType === "ARTISTE"){
            this.isAdd = false;
          } else{
            this.client = this.authService.getClientConnected();
            //console.log("client connect", this.client)
          }
      }

      this.artisteService.getArtistes().subscribe(
        response => {
          this.artistes = response;
        });
  }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 1000); // Skeleton Loader
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

  onGetImage(){
    this.imageService.getAllImage().subscribe(
      response => { 
        this.imageRes = response;
        console.log("image",this.imageRes);
        for (let i = 0; i < this.imageRes.length; i++) {
          this.allYears.push(this.imageRes[i].annee);
          this.findMinMax(this.allYears);
        }
        this.imageFiltres = this.imageRes;
        console.log("imageFiltres",this.imageFiltres)
      });
    
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

  addToList(oeuvreNumerique: any) {
  

    this.oeuvreNumeriqueSave.annee = oeuvreNumerique.annee;
    this.oeuvreNumeriqueSave.avatar = oeuvreNumerique.avatar;
    this.oeuvreNumeriqueSave.description = oeuvreNumerique.description;
    this.oeuvreNumeriqueSave.id = oeuvreNumerique.id;
    this.oeuvreNumeriqueSave.identiteAuteur = oeuvreNumerique.identiteAuteur;
    this.oeuvreNumeriqueSave.isDisabledAdd = oeuvreNumerique.isDisabledAdd;
    this.oeuvreNumeriqueSave.isDisabledRemove = oeuvreNumerique.isDisabledRemove;
    this.oeuvreNumeriqueSave.largeur = oeuvreNumerique.largeur;
    this.oeuvreNumeriqueSave.longueur = oeuvreNumerique.longueur;
    this.oeuvreNumeriqueSave.motscles = oeuvreNumerique.motscles;
    this.oeuvreNumeriqueSave.nom = oeuvreNumerique.nom;
    this.oeuvreNumeriqueSave.tarif = oeuvreNumerique.tarif;
    this.oeuvreNumeriqueSave.technique = oeuvreNumerique.technique;
    this.oeuvreNumeriqueSave.titre = oeuvreNumerique.titre;


    console.log("item to add", this.oeuvreNumeriqueSave)  
   if(this.user==null){
      this.router.navigate(['/pages/login']);  
         
     }else{
      this.productService.addToList( this.oeuvreNumeriqueSave); 
      console.log("add success")    
     }
   
  }

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }


  addToCart(oeuvre: any) {
    if(this.user==null){
      this.router.navigate(['/auth', 'account']);      
     }else{
      this.productService.addToCart(oeuvre);
     }
  }
  

  addToWishlist(oeuvre: any) {
    this.productService.addToWishlist(oeuvre);
  }

  addToCompare(oeuvre: any) {
    this.productService.addToCompare(oeuvre);
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

  getArtisteName(idArtiste){
    for (let i = 0; i < this.artistes.length; i++) {
      if (this.artistes[i].id === idArtiste){
        this.artisteName = this.artistes[i].prenom + " " + this.artistes[i].nom;
        break;
      }
      
    }
    return this.artisteName;
  }

  findMinMax(tab: number[]){

    console.log("table des aneeeeeeeeeeeee",tab)
    let min = tab[0];
    let max = tab[0];
    for (let i = 0; i < tab.length; i++) {
      if(max < tab[i]){
        max = tab[i];
      }
      if(min > tab[i]){
        min = tab[i];
      }
    }
    this.minYears = min;
    this.maxYears = max;
    console.log("Maxxxxxxxxxx anneee", this.maxYears);
    console.log("Minnnnnnnnnn anneee", this.minYears);
  }
}
