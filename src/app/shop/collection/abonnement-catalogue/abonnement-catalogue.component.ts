import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import { Oeuvre } from '../../../shared/modeles/oeuvre';
import { ArticleService } from '../../../shared/services/article.service';
import { environment } from '../../../../environments/environment';
/*import { ArticleService } from 'src/app/shared/services/article.service';
import { Oeuvre } from 'src/app/shared/modeles/oeuvre';
import { environment } from 'src/environments/environment';
import { Options } from 'ng5-slider';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';*/
import { Options } from 'ng5-slider';
import { OeuvreService } from '../../../shared/services/oeuvre.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderConfig, NgxUiLoaderService, POSITION, SPINNER } from 'ngx-ui-loader';

/*const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'rgba(12,80,219,0.98)',
  bgsOpacity: 1,
  bgsPosition: POSITION.bottomRight,
  bgsSize: 40,
  bgsType: SPINNER.ballScaleMultiple,
  fgsColor: 'rgba(12,80,219,0.98)',
  fgsPosition: POSITION.centerCenter,
  logoUrl: "src/assets/images/logo_signart.png",
  masterLoaderId: "loader-01"
  };*/
  
import { OeuvreNumerique } from '../../../shared/modeles/imageNumerique';
import { Artiste } from '../../../shared/modeles/artiste';
import { Pays } from '../../../shared/modeles/pays';
import { Client } from '../../../shared/modeles/client';
import { Biographie } from '../../../shared/modeles/exposition';
import { ImageService } from '../../../shared/services/image.service';
import { ArtisteService } from '../../../shared/services/artiste.service';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { CheckoutService } from '../../../shared/services/checkout.service';
import { PaysService } from '../../../shared/services/pays.service';
import { Address } from '../../../shared/modeles/address';
import { User } from '../../../shared/modeles/user';
import { ListSelection, Abonne, Abonnement, Terminal, EtatAbonnement, DelaieAbonnement, TerminalDelai, ListeSelection_Oeuvres } from '../../../shared/modeles/utilisateur';

@Component({
  selector: 'app-abonnement-catalogue',
  templateUrl: './abonnement-catalogue.component.html',
  styleUrls: ['./abonnement-catalogue.component.scss']
})
export class AbonnementCatalogueComponent implements OnInit {
  

  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public techSelect: string;
  public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];
  public oeuvresSave: Oeuvre[] = [];
  public brands: any[] = [];
  public artist: any [] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public maxValue: number = 0;
  public minPrice: number = 0;
  public maxPrice: number = 1000000;
  public tags: any[] = [];
  public category: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  //public loader: boolean = true;
  public collapse: boolean = true;
  public collapseCategorie: boolean = true;
  public currency: any;
  public cartModal: boolean;
  public oeuvresNumeriques: OeuvreNumerique[] = [];
  public options: Options = {
    floor: 0,
    ceil: 5000000 //a modifier: mettre la valeur de l'oeuvre le plus chére
  };

  pageSize = 12;
  pag=1;
  pg=1;
  //size:number;
  pageSizeListe = 2;
  artisteName: string;


  urlimg: any;
  private base64Image: string;
  imageRes: OeuvreNumerique[];
  imageRes2: OeuvreNumerique[];
  //image: ImageBrut;
  imageFiltres: OeuvreNumerique[];
  imageFiltresSave: OeuvreNumerique[];
  auteur: Artiste[];
  annee: any[];
  filtres: any[];
  sousFiltres: any;
  filtre: any;
  etapeFiltre: number;
  techniques: any;
  private _searchTerm: string;
  onglet: number;
  listeSelection: ListSelection;
  imageSelect: OeuvreNumerique;
  montantTotal: number;
  //abonneeForm: FormGroup;
  //terminalDelaiForm: FormGroup;
  loginForm: FormGroup;
  abonne: Abonne;
  user: User;
  abonnement: Abonnement;
  terminals: Terminal[];
  etats: EtatAbonnement[];
  delais: DelaieAbonnement[];
  public terminalChoisi: Terminal;
  public delaiChoisi: DelaieAbonnement;
  terminalDelai: TerminalDelai;
  listeOeuvre: OeuvreNumerique[];
  idUtilisateur: number;
  terminalId: number;
  delaiId: number;
  idAbonne: number;
  listeRes: ListSelection;
  idListeRes: number;
  abonneRes: Abonne;
  idAbonneRes: number;
  listeUtilisateur: ListSelection;
  idEtatAbonnement: number;
  listeAdd: ListSelection;
  page: number;
  login: number;
  utilisateurs: any[];
  idUsers: any[];
  connexionFailed: boolean;
  tech: any;
  artistes: Artiste[];
  art: any;
  userConnect:User;
  userAccess: number;
  testAbonne: Abonne;
  image: OeuvreNumerique;
  userWho: number;
  allPays: Pays[] = [];

  allClientAdresse: any;
  clientAdresse: Address;
  
  client: Client;
  allYears: number[];
  minYears: number;
  maxYears: number;
  yearFiltre: number;
  allUserListe: ListSelection[];
  breakpoint: number;
  showAuteur: boolean;
  infoImage: OeuvreNumerique;
  infoAuteur: any;
  biographie: Biographie;
  pageFormu: number;
  public terminalChoix: Terminal;
  public delaiChoix: DelaieAbonnement;
  public indicatifpays: string;
  public libellePays: string;
  
  
  abonneeForm = new FormGroup({
    nom: new FormControl('',Validators.required),
    prenom: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
    telephone: new FormControl('',[Validators.required,Validators.pattern('[0-9]{9}')]),
    pays: new FormControl('',Validators.required),
    region: new FormControl('',Validators.required),
    ville: new FormControl('',Validators.required),
    adresse: new FormControl('',Validators.required),
  });
  
  terminalDelaiForm = new FormGroup({
    terminalId: new FormControl(null,Validators.required),
    delaiId: new FormControl(null,Validators.required),
    precisions: new FormControl(''),
  });


  //@ViewChild("quickView") QuickView: QuickViewComponent;

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    console.log(value)
    this.imageFiltres = this.filtrerImage(value);
  }

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService, private ngxService: NgxUiLoaderService,
    private articleService: ArticleService, private expoService: OeuvreService,
    private fb: FormBuilder,private imageService: ImageService, private artisteService:ArtisteService,
    private authS:AuthServiceS,private checkoutService:CheckoutService,private httpClient: HttpClient, 
    public domSanitizer: DomSanitizer,private paysService: PaysService, private toastrService: ToastrService ) { 

      this.indicatifpays = "+221";
      this.libellePays = "Sénégal";
      

      
      this.annee = [2020,2019,2018,2011];
      this.currency = this.productService.Currency;
      this.cartModal = false;
      this.pageFormu = 0;
      // this.techniques = ["Peinture","Fusain","Photo"];
       this.etapeFiltre = 0;
       this.onglet = 1;
       this.page = 0;
       this.listeSelection = new ListSelection(null,'');
       this.listeOeuvre = [];
       this.montantTotal = 0;
       this.idUtilisateur = 0;
       this.listeSelection.idUtilisateur = this.idUtilisateur;
       this.terminalDelai = new TerminalDelai('','',null,null,'');
       this.listeAdd = new ListSelection(null,'');
       this.abonnement = new Abonnement(null,null,null,null,null,"",null);
       this.listeUtilisateur = new ListSelection(null,'');
       this.connexionFailed = false;
       this.techniques = [];
       this.artistes = [];
       this.userAccess = 0;
       this.abonneRes = new Abonne(null,null,'','','','','','','','');
       this.userWho = 0;
       this.clientAdresse = new Address('','','','','','','','','','');
      
       this.imageFiltres =[];
       this.client = new Client('',null,null,null,'','',null,'','','','','',null,'');
       this.allYears = [];
       this.userConnect=this.authS.getUserConnected();
       this.showAuteur = false;
       this.infoImage = new OeuvreNumerique(0,'','',0,0,'',0,'',null,0,'',false,false);
       this.biographie = new Biographie('',null,'','',false,null);

      this.allYears = [];
      this.imageFiltres = [];
      this.imageFiltresSave = [];
      this.techSelect = "Tout";
      this.onGetImage();
      this.productService.listItems.subscribe(response => this.oeuvresNumeriques = response);
      this.userConnect=this.authS.getUserConnected();
      this.idUtilisateur = this.userConnect.id;
      this.imageService.getClientByUser(this.userConnect.id).subscribe(
        res =>{
          this.client = res;
          this.imageService.getAllCientAdresse(this.client.id).subscribe(
            resp =>{
              this.allClientAdresse = resp;
              if(this.allClientAdresse.length > 0){
                this.clientAdresse = this.allClientAdresse[0];
                this.indicatifpays = this.clientAdresse.telephone;
                //console.log("adressssssssssssse clienttttttt",this.clientAdresse)  
              }
              this.onglet=2;
            });
        });    
      // Get Query params..
      this.artisteService.getArtistes().subscribe(
        response => {
          this.artistes = response;
        });

        this.paysService.getAllPays().subscribe(
          pays => { this.allPays = pays});
          this.imageService.getAllDelai().subscribe(
            response => { 
              this.delais = response;
              //console.log("delais",this.delais);
            });
      
            this.imageService.getAllTerminal().subscribe(
              response => { 
                this.terminals = response;
                //console.log("terminals",this.terminals);
              });
            this.imageService.getAllEtat().subscribe(
              response => { 
                this.etats = response;
                //console.log("etats",this.etats);
              });
      this.expoService.getTechnique().subscribe(response => {
        this.techniques = response
        //console.log("tech", this.techniques)
      });
      this.articleService.getAllArticles().subscribe(response => { 
        this.oeuvres = response;
        this.oeuvresSave = this.oeuvres;
        this.maxValue = this.maxYears;
        this.options = {floor: this.minYears, ceil: this.maxValue}
      });
      
              
      this.route.queryParams.subscribe(params => {

        this.brands = params.brand ? params.brand.split(",") : [];
        this.artist= params.artidt ? params.artist.split(","): [];
        this.colors = params.color ? params.color.split(",") : [];
        this.size  = params.size ? params.size.split(",")  : [];
        this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
        this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
        this.tags = [...this.brands, ...this.colors, ...this.size]; // All Tags Array
        
        this.category = params.category ? params.category : null;
        this.sortBy = params.sortBy ? params.sortBy : 'ascending';
        this.pageNo = params.page ? params.page : this.pageNo;

        this.productService.filterOeuvre(this.tags).subscribe(response => {         
          
          this.oeuvres = this.productService.sortOeuvres(this.oeuvres, this.sortBy);
          this.oeuvres = this.oeuvres.filter(item => item.prix >= this.minPrice && item.prix <= this.maxPrice) 
          //console.log("paginationnnnn", this.paginate)
        });
      })
  }

  ngOnInit(): void {
   
   /* if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }*/
  }

  choisirPays(event) {
    console.log(event.target.value)
    for (let i = 0; i < this.allPays.length; i++) {
       if(this.allPays[i].code === event.target.value){
         console.log(this.allPays[i].indicatif)
         this.indicatifpays = this.allPays[i].indicatif;
       }
      
    }
  }

  onSubmitFormuAbonne(){
    this.abonne = this.abonneeForm.value;
    this.abonne.idUtilisateur = this.idUtilisateur;
    this.imageService.getListeByName(this.listeAdd.nomListe).subscribe(
      response => { 
        let liste = response;
        this.abonne.idListeSelection = liste.id;
      });
    //console.log(this.abonne)
    //console.log("inof formulaire", this.abonneeForm.value)
    //console.log("inof abonne", this.abonne)
    this.pageFormu = 2;
  }

  onSubmitFormuTermi(){
    const model = this.terminalDelaiForm.value;
    this.terminalDelai.delaiId = model.delaiId;
    this.terminalDelai.terminalId = model.terminalId;
    this.terminalDelai.precisions = model.precisions;
    
    for (let i = 0;i <this.terminals.length; i++) { 
      if(this.terminals[i].id == this.terminalDelai.terminalId){
        this.terminalId = this.terminals[i].id;
        this.terminalChoisi = this.terminals[i];
        //console.log("termi - : ",this.terminalId)
       this.terminalDelai.terminalLibelle = this.terminals[i].libelle;
       this.montantTotal = this.montantTotal + this.terminals[i].prix;
      }
    }
    for (let i = 0;i <this.delais.length; i++) { 
      if(this.delais[i].id == this.terminalDelai.delaiId){
       this.terminalDelai.delaiLibelle = this.delais[i].libelle;
       this.delaiChoisi = this.delais[i];
       this.delaiId = this.delais[i].id;
       //console.log(" - delai: ",this.delaiId)
       this.montantTotal = this.montantTotal + this.delais[i].prix;
      }
    }
    //console.log("termi - delai: ",this.terminalDelai)
    this.showResum();
  }

  filtrerImage(searchString: string){
    console.log("test",this.imageRes)
    return this.imageRes.filter(image =>
      image.motscles.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }


  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  updateFilterAnnee() {
    this.imageFiltres = this.imageFiltresSave;
    this.imageFiltres = this.imageFiltres.filter(item => item.annee >= this.minYears && item.annee <= this.maxYears) 
    /*//console.log("min price ",this.minPrice);
    //console.log("max price ",this.maxPrice);*/
    
  }

  updateFilterCategorie(technique: string) {
    this.techSelect = technique;
    this.imageFiltres = this.imageFiltresSave;
    this.imageFiltres = this.imageFiltres.filter(item => item.technique == technique) 
    ////console.log("technique ",idTechnique);
    
    
  }

  resetFilterCategorie() {
    this.techSelect = "Tout";
    this.imageFiltres = this.imageFiltresSave;
  }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null},
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Remove Tag
  removeTag(tag) {
  
    this.brands = this.brands.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);
    this.size = this.size.filter(val => val !== tag );

    let params = { 
      brand: this.brands.length ? this.brands.join(",") : null, 
      color: this.colors.length ? this.colors.join(",") : null, 
      size: this.size.length ? this.size.join(",") : null
    }

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  removeAllTags() {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  public get getTotal(): Observable<number> {   
    return this.productService.listTotalAmount();
  }

  // product Pagination
  setPage(page: number) {
    //console.log("number page", page)
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false,  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if(value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }
  
  showResum(){
    this.pageFormu = 3;
    this.getTotal.subscribe(response => { 
      this.montantTotal = this.montantTotal + response;});
    //console.log("montant total "+ this.montantTotal)

  }

  maxPriceValue(oeuvres: Oeuvre[]): number{
    let min = 0;
    for (let i = 0; i < oeuvres.length; i++) {
      if(this.maxValue < oeuvres[i].prix){
        this.maxValue = oeuvres[i].prix;
      }  
    }
    return this.maxValue;
  }


  getTechniqueName(technique: string): string{
    for (let i = 0; i < this.techniques.length; i++) {
      if(this.techniques[i].libelle == technique){
        return this.techniques[i].libelle
        break;
      }
      
    }
  }

  get filterbyCategory() {
    const category = [...new Set(this.imageFiltresSave.map(oeuvre => oeuvre.technique))]
    return category
  }

  onGetImage(){
    this.imageService.getAllImage().subscribe(
      response => { 
        this.imageRes = response;
        ////console.log("image",this.imageRes);
        for (let i = 0; i < this.imageRes.length; i++) {
          this.allYears.push(this.imageRes[i].annee);
          this.findMinMax(this.allYears);
        }
        this.imageFiltres = this.imageRes;
        this.imageFiltresSave = this.imageRes;
        ////console.log("imageFiltres",this.imageFiltres)
      });   
  }

  findMinMax(tab: number[]){
   // //console.log("table des aneeeeeeeeeeeee",tab)
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
  // //console.log("Maxxxxxxxxxx anneee", this.maxYears);
    ////console.log("Minnnnnnnnnn anneee", this.minYears);
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

  addToList(item: OeuvreNumerique){   
    if(this.userWho == 1){
      Swal.fire({
        icon: 'error',
        title: 'Impossible...',
        text: 'Veuillez vous connecter pour accéder a cette fonctionalité',
        footer: '<a href=\'auth/login\'><b>Connexion<a></a>'
      })
    }else{
      //console.log("item",item)  
    //console.log("liste push",this.listeOeuvre.push(item));
    this.montantTotal = this.montantTotal + item.tarif;
    item.isDisabledAdd = true;
    item.isDisabledRemove = false;
    
    }
    
  }

 

  public removeListItem(oeuvreNumeriques: any) {
    this.productService.removeListItem(oeuvreNumeriques);
  }

  public removeList() {
    this.productService.removeList();
  }

  getOeuvreImage(idOeuvre: number){
    for (let i = 0; i < this.imageFiltresSave.length; i++) {
      if(this.imageFiltresSave[i].id == idOeuvre){
        return this.imageFiltresSave[i].avatar;
      }
      
    }
  }

  saveListe(){  
    this.pageFormu = 1; 
    this.imageService.getAllListeByUser(this.idUtilisateur).subscribe(
      response => { 
        this.allUserListe = response;
        this.listeAdd.idUtilisateur = this.idUtilisateur;
        this.listeAdd.nomListe = this.idUtilisateur+"Liste"+(this.allUserListe.length+1);
        ////console.log("liste crée: ",this.listeAdd);
        this.imageService.addListe(this.listeAdd).subscribe(
          response => { 
            ////console.log("liste crée!!");     
          });
      });
  }

  onSubmitFinal(){
    
    Swal.fire({
      title: 'Etes vous sure de vouloir soumettre cet abonnement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'btn btn-success',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OUI!'
    }).then((result) => {
      this.ngxService.startLoader("loader-01"); // start foreground spinner of the loader "loader-01" with 'default' taskId

      this.imageService.addAbonne(this.abonne).subscribe(
        respon =>{
          ////console.log(respon)
          if(respon != null){
            let abonnee: Abonne = respon
            console.log("abonneee creerr ", abonnee)
            this.imageService.getAbonneByListe(this.abonne.idListeSelection).subscribe(
              response => { 
                this.abonneRes = response;
               
                ////console.log("abonneee creerr ", this.abonneRes)
                ////console.log('abonneRes',this.abonneRes);
                     // ////console.log("listId",this.listeSelection.id)
                      ////console.log("abonneId",this.abonneRes.id)
                      ////console.log("delaiId",this.delaiId)
                      ////console.log("terminalId",this.terminalId)
                      console.log("abonne ress",this.abonneRes)
                      this.abonnement.idTerminal = this.terminalId;
                      this.abonnement.idDelai = this.delaiId;
                      this.abonnement.montantPaiement = this.montantTotal;
                      this.abonnement.idListeSelection = this.abonneRes.idListeSelection;
                      this.abonnement.idAbonne = this.abonneRes.id;
                      if(this.terminalDelai.terminalLibelle === "Tv box"){
                        this.abonnement.precisions = this.terminalDelai.precisions;
                      }else{
                        this.abonnement.precisions = "RAS";
                      }
                      
                      for(var i=0; i<this.etats.length; i++){
                        if(this.etats[i].code === "EN_COURS"){
                          this.idEtatAbonnement = this.etats[i].id;
                        }
                      }
                      ////console.log("id etat",this.idEtatAbonnement)
                      this.abonnement.etatAbonnement = this.idEtatAbonnement
          
                      
                      
                      this.listeOeuvre = this.oeuvresNumeriques;
                      console.log("la liste des oeuvres",this.listeOeuvre)
                      console.log("abonne rs",this.abonneRes)
                      for (let i = 0; i < this.listeOeuvre.length; i++) {
                        const listoeuvre = new ListeSelection_Oeuvres(null,null);
                        listoeuvre.idListe = this.abonneRes.idListeSelection;
                        listoeuvre.nomOeuvre = this.listeOeuvre[i].nom;
                        console.log(listoeuvre)
                        this.imageService.addListOeuvre(listoeuvre).subscribe(
                          respon => { 
                            console.log("add image"+listoeuvre)
                            
                          }); 
                      }
                      this.imageService.addAbonnement(this.abonnement).subscribe(
                        resp =>{
                          ////console.log(resp)
                          console.log("abonnement",this.abonnement)
                          this.oeuvresNumeriques = [];
                          setTimeout(() => {
                            this.ngxService.stopLoader("loader-01"); // stop foreground spinner of the loader "loader-01" with 'default' taskId
                          }, 3000);
                          this.toastrService.success('Abonnement soumis avec succés!');
                          this.onReset(0);
                          
                        }
                      );         
            });
  
          }           
          });
        });       
  }

  onReset(valeur: number){
    this.pageFormu = 0;
    this.terminalDelaiForm.reset();
    this.abonneeForm.reset();
  //  this.onInitForm();
    this.removeList();
    this.connexionFailed = false;
    if(valeur == 0){
      this.page = 0;
      this.onglet = 1;
      this.montantTotal = 0;
      this.listeOeuvre = [];
      this.onGetImage();
    }
  }

  


 
}
