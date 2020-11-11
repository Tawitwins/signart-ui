import { Product } from './../../shared/classes/product';
import { ProductService } from './../../shared/services/product.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisiteurService } from '../../shared/services/visiteur.service';
import { Oeuvre } from '../../shared/modeles/oeuvre';
import { Suivre } from '../../shared/modeles/suivre';
import { Exposition } from '../../shared/modeles/exposition';
import { Formation, Presentation } from '../../shared/modeles/artiste';
import { Visiteur } from '../../shared/modeles/visiteur';
import { Pays } from '../../shared/modeles/pays';
import { ArticleService } from '../../shared/services/article.service';
import { ArtisteService } from '../../shared/services/artiste.service';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { PaysService } from '../../shared/services/pays.service';
import { environment } from '../../../environments/environment';

declare interface MenuInfo {
  path: string;
  title: string;
  id: string;
}
const Personnel = 'Personnel';
const Collective = 'Collective';
const Autres = 'Autres';

export const NAVIGATION: MenuInfo[] = [
  { path: '#profil', title: 'Biographie', id: 'profil' },
  { path: '#formation', title: 'Formation', id: 'formation' },
  { path: '#presentation', title: 'Presentation', id: 'presentation' }
  /*
  { path: '#mes-expots', title: 'Mes expots', id: 'mes-expots' },
  { path: '#annoncer-event', title: 'Mes annonces', id: 'annoncer-event' },
  { path: '#abonnement', title: 'Abonnement', id: 'abonnement' },
  { path: '#oeuvres', title: 'Mes oeuvres', id: 'mesoeuvres' },
  */

];

@Component({
  selector: 'app-artiste',
  templateUrl: './artiste.component.html',
  styleUrls: ['./artiste.component.scss']
})
export class ArtisteComponent implements OnInit {

  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];
  public brands: any[] = [];
  public artist: any [] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 3000000;
  public tags: any[] = [];
  public category: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  actionsSubscription: Subscription;

  suivre: Suivre;
    navigations: any[];
    artisteId: number;
    artiste: any;
    listes: Subscription;
    listes1: any;
    listesExp: Exposition[];
    listesAnnonce: Subscription | any;
    listesClient: Subscription | any;
    listesFormation: Formation[] | any;
    suivreart = 'Suivre';
    couleur = '#f07c10';
    user: any;
    suiv: boolean = true;
    isVisiteur: boolean = true;
    tabPerso: any = [];
    tabCollec: any = [];
    tabAutres: any = [];
    marq: any;
    client: any;
    visiteur: Visiteur;
    FormVisiteur: FormGroup;
    allPays: Pays[] = [];
    artistePresentation: Presentation;
    selectedPays: string;
    
    initForm() {
        const Prenom = '';
        const Nom = '';
        const RaisonSociale = '';
        const TypeVisiteur = '';
        const Pays = '';
    
       /* this.FormVisiteur = this.fb.group({
          'Prenom': [Prenom, Validators.compose([Validators.required])],
          'Nom': [Nom, Validators.compose([Validators.required])],
          'RaisonSociale': [RaisonSociale, Validators.compose([Validators.required])],
          'TypeVisiteur': [TypeVisiteur, Validators.compose([Validators.required])],
          'Pays': [Pays, Validators.compose([Validators.required])],
    
        }, 
        );*/
      }

  constructor(private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService,public articleService: ArticleService,
    private artisteService: ArtisteService, private route: ActivatedRoute, private oeuvreService: OeuvreService,
        private expoService: OeuvreService, private annonceService: OeuvreService, private clientService: OeuvreService,
        private suivreService: OeuvreService, 
        //private userAuth: AuthServiceS,private fb: FormBuilder,
        private paysService: PaysService, private visiteurService: VisiteurService,@Inject(DOCUMENT) document) {   
      // Get Query params..
     
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

        // Get Filtered Products..
        this.productService.filterProducts(this.tags).subscribe(response => {         
          // Sorting Filter
          this.products = this.productService.sortProducts(response, this.sortBy);
          // Category Filter
          if(params.category)
            this.products = this.products.filter(item => item.type == this.category);
          // Price Filter
          this.products = this.products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice) 
          // Paginate Products
          this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
          this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
        })
      })

      

      this.actionsSubscription = this.route.params.subscribe(
        (params: any) => {
            this.artisteId = params['id'];
            console.log('id artiste: ' + this.artisteId)
            this.artisteService
                .getArtiste(this.artisteId)
                .subscribe(response => {
                    this.artiste = response
                    this.expoService.getOeuvreByArtiste(this.artiste.id).subscribe(response => { 
                      this.oeuvres = response;
                     });
                    this.artisteService.getAllPresentation(this.artiste.id).subscribe(
                        resp => { 
                          this.artistePresentation = resp;
                        console.log('Presentation',this.artistePresentation);
                    });
                    // console.log('artiste:' + this.artiste ? this.artiste.idClient : 0);
                });

            // console.log('c moi');
        }
    );

    this.oeuvres = this.productService.sortOeuvres(this.oeuvres, this.sortBy);
      this.oeuvres = this.oeuvres.filter(item => item.prix >= this.minPrice && item.prix <= this.maxPrice) 
      this.paginate = this.productService.getPager(this.oeuvres.length, +this.pageNo); 
      this.oeuvres = this.oeuvres.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
      console.log("paginationnnnn", this.paginate)
  
   // this.user = this.userAuth.getUserConnected();
    this.isVisiteur=false;
  }

  ngOnInit() {
    this.navigations = NAVIGATION.filter(navigation => navigation);
    this.initForm();
    this.visiteur = new Visiteur(null,"","","","","",0);
    //console.log(Visiteur.prenom+Visiteur.nom+Visiteur.pays+Visiteur.typeVisiteur+Visiteur.raisonSociale);
    this.paysService.getAllPays().subscribe(pays => this.allPays = pays);
    this.oeuvreService.getOeuvreByArtiste(this.artisteId).subscribe(response => { this.listes = <any>response });
    this.expoService.getExpoByArtiste(this.artisteId).subscribe(response => {
        this.listesExp = <Exposition[]>response;
        this.listesExp.forEach(element => {
            if (element.type == Personnel) {
                this.tabPerso.push(element);
            }
            if (element.type == Collective) {
                this.tabCollec.push(element);
            }
            if (element.type == Autres) {
                this.tabAutres.push(element);
            }

        });
    });
    this.annonceService.getAnnoceByArtiste(this.artisteId).subscribe(response => { this.listesAnnonce = response });
    this.clientService.getClientByArtiste(this.artisteId).subscribe(response => { this.listesClient = response });
    this.expoService.getFormationByArtiste(this.artisteId).subscribe(response => { this.listesFormation = response
        console.log(this.listesFormation);
    }
       
        );
    if (this.user) {
        this.suivreService.getClientByUser(this.user.id)
            .subscribe(
                response => {
                    this.client = response
                    this.suivreService.getMarquageByArtiste(+this.client.id, +this.artisteId, 'SUIV')
                        .subscribe(response => { this.marq = response });
                    if (this.marq != null) {
                        this.suivreart = 'Ne plus suivre';
                        this.couleur = 'grey';
                    } else {
                        this.suivreart = 'Suivre';
                        this.couleur = '#f07c10';
                    }
                });
    }
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

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
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


  getArtisteImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
}
getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
}

suivi() {
    if(this.client!=null)
    {
        this.isVisiteur=false;
        this.suivreService.getMarquageByArtiste(+this.client.id, +this.artisteId, 'SUIV')
        .subscribe(response => { this.marq = response });
        if (this.marq == null) {
            console.log('mmmmkl' + this.client.id);
            this.suivre = new Suivre(null,'SUIV', new Date(), +this.artisteId, this.client.id, 2,this.visiteur.id);
            this.suivreService.suivreArtiste(this.suivre).subscribe(res => this.listes1 = res);
            this.suivreart = 'Ne plus suivre';
            this.couleur = 'grey';
            console.log('affiche ' + this.suivre+this.isVisiteur);
        } else {
            this.oeuvreService.plusSuivreArtiste(this.client.id, this.artisteId, 'SUIV').subscribe();
            this.suivreart = 'Suivre';
            this.couleur = '#f07c10';
            console.log('skguybgg'+this.isVisiteur);
        }
        /*  if((this.client.id == this.marq.idClient) && (this.artisteId == this.marq.idArtiste) && (this.marq.codeTypeMarquage=='SUIV'))

        console.log('mmmmkl'+ this.client.id);
        this.suivre = new Suivre('SUIV', new Date(), +this.artisteId, this.user.id, 2);
        this.suivreService.suivreArtiste(this.suivre).subscribe(res => this.listes1 = res);
        this.suivreart = 'Ne plus suivre';
        this.couleur = 'grey';
        console.log('affiche ' + this.suivre);

        noSuivi() {
        this.oeuvreService.plusSuivreArtiste(this.client.id, this.artisteId, 'SUIV').subscribe();
        this.suivreart = 'Suivre';
        this.couleur = 'rgb(239, 83, 80)';
        console.log('affiche non suivi ' + this.suivre);
    }*/
    }
    else
    {
        console.log('Aucune connexion est active');
        if(this.suivreart == 'Suivre')
            this.isVisiteur=true;
        else
        {
            this.isVisiteur=false;
            console.log("Mon artiste: "+ this.artiste.id + "Mon visiteur: " + this.visiteur.id); 
            var result = this.oeuvreService.plusSuivreArtisteByVisiteur(this.suivre.id);
            if(result==null)
                console.log("Aucun élément a été trouvé pour la suppresion");
            else
            {
                result.subscribe(
                    (val) => {
                   console.log("DELETE request en cours ....", <String>val 
                               );
                               var valSuivre = <Suivre>val;
                               if(valSuivre.id==this.suivre.id)
                               {
                                    this.suivreart = 'Suivre';
                                    this.couleur = '#f07c10';
                                    console.log('Succés. Vous ne suivez plus cet artiste '+this.artiste.id);
                               }
                               else
                               {
                                    console.log("Cas particulers !! Val = "+ <Suivre>val );
                               }
               },
               response => {
                   console.log("DELETE call in error", response);
               },
               () => {
                   console.log("The DELETE observable is now completed.");
               });
            }
            //this.oeuvreService.plusSuivreArtisteByVisiteur(this.suivre.id)
           
        }
    }
    
}
onSubmit(){
    //onsole.log(Visiteur.prenom+Visiteur.nom+Visiteur.pays+Visiteur.typeVisiteur+Visiteur.raisonSociale);
    console.log("Visiteur en cour d'enregistrement...");
    const values = this.FormVisiteur.value;
    console.log('values: ', values)
    const keys = Object.keys(values);
    console.log(values);
    this.visiteur.pays =this.allPays.find(p=>p.libelle=this.selectedPays);
    this.visiteur.idPays= this.visiteur.pays.id;
    console.log(this.visiteur);
    if (this.FormVisiteur.valid) {
        console.log("Visiteur a été enregistrer avec succés");
        console.log(this.visiteur);
        /*this.visiteur.prenom = values.prenom;
        this.visiteur.nom = values.nom;
        this.visiteur.pays = values.pays;
        this.visiteur.raisonsociale = values.raisonSociale;
        this.visiteur.typeVisiteur = values.typeVisiteur;*/
        //this.visiteur.idPays = this.visiteur.pays.id;
        console.log(this.visiteur.pays);
        var result =this.visiteurService.createVisiteur(this.visiteur);
        result.subscribe(  
            (val) => {
                console.log("POST call (save visiteur) successful value returned in body", val); 
                this.visiteur=<Visiteur>val; 
                console.log("Mise a jour ici", this.visiteur); 
                alert("Identification réussi et suivi approuvé.");
                this.suivre = new Suivre(null,'SUIV', new Date(), this.artisteId, 0, 2,this.visiteur.id);
                console.log("Mon marquest est là "+ this.suivre);
                this.suivreService.suivreArtiste(this.suivre).subscribe( (val) => {
                    console.log("POST call successful (set marque) value returned in body", 
                                val);
                                console.log("Reponse souscription", this.listes1);
                                this.suivreart = 'Ne plus suivre';
                                this.couleur = 'grey';
                                document.getElementById('Visiteur').click();
                                this.suivre= <Suivre>val;
                    },
                    response => {
                        console.log("POST call (set marque) in error", response);
                    },
                    () => {
                        console.log("The POST observable (set marque) is now completed.");
                    });
              
               // console.log('affiche ' + this.suivre+this.isVisiteur);
            },
            response => {
                console.log("POST call (save visiteur) in error", response);
                console.log("Un problème lors de l'enregistrement des vos informations !!" + result );
            },
            () => {
                console.log("The POST (save visiteur) observable is now completed.");
        });
        /*this.registerSubs = this.authService.register(values).subscribe(
          data => {     console.log('datas: ', data)
  
            this.authService.login(values.email, values.password).subscribe(
              resp => console.log('resp: ', data)
            );
          }
          );*/
      } else {
        console.log("Un problème a été rencontré avec le formulaire du visiteur ");
        keys.forEach(val => {
          const ctrl = this.FormVisiteur.controls[val];
          if (!ctrl.valid) {
            this.pushErrorFor(val, null);
            ctrl.markAsTouched();
          };
        });
      }
}
ClickCreateAccount(){
    this.isVisiteur=false;
}
private pushErrorFor(ctrl_name: string, msg: string) {
    this.FormVisiteur.controls[ctrl_name].setErrors({ 'msg': msg });
  }



}
