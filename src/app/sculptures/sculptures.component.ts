import { Component, OnInit, ChangeDetectorRef, OnChanges, Input } from '@angular/core';
import { SousMenu } from '../shared/modeles/sous-menu';
import { Subscription ,  Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces';
import { ArticleActions } from '../detail-article/actions/article-actions';
import { getProducts } from '../detail-article/reducers/selectors';
import { SearchActions } from './reducers/search.actions';
import { getSelectedTaxonIds, getFilters } from './reducers/selectors';
import { OeuvreService } from '../shared/services/oeuvre.service';
import { Technique } from '../shared/modeles/technique';

/*declare interface SousMenuInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}*/

/*declare interface ImageInfo {
  source: string;
  title: string;
  description: string;
  artiste: string;
  prix:string;
}
*/
export const SOUS_MENUS: SousMenu[] = [
  { path: '#tout', title: 'Tout', icon: './assets/img/Icones/Tout.png', class: '', id: 0 },
  { path: '#bois', title: 'Bois', icon: './assets/img/Icones/bois.png', class: '', id: 1 },
  { path: '#verre', title: 'Verre', icon: './assets/img/Icones/verre.png', class: '', id: 7 },
  { path: '#bronze', title: 'Bronze', icon: './assets/img/Icones/bronze.png', class: '', id: 8 },
  { path: '#ceramique', title: 'Ceramique', icon: './assets/img/Icones/Ceramique.png', class: '', id: 9 },
  { path: '#technique-mixte', title: 'Technique mixte', icon: './assets/img/Icones/Mixte.png', class: '', id: 10 },
  { path: '#art-urbain', title: 'Art urbain', icon: './assets/img/Icones/Urbain.png', class: '', id: 11 },
];

// export const ABSTRAITS: ImageInfo[] = [
// { source: '/assets/img/sculptures/bois/S-B.jpg', title: 'Chevres',  description: 'description', artiste: 'Kalidou Kassé', prix:"$12" },
// { source: '/assets/img/sculptures/bois/S-B1.jpg', title: 'Elephant',  description: 'description', artiste: 'Kalidou Kassé', prix:"$14" },
// { source: '/assets/img/sculptures/bois/S-B2.jpg', title: 'Jeune fille',  description: 'description', artiste: 'Kalidou Kassé', prix:"$15
// " },
// { source: '/assets/img/sculptures/bois/S-B3.jpg', title: 'Eclipse solaire',  description: 'description', artiste: 'Kalidou Kassé', prix:
// "$13" },
// { source: '/assets/img/sculptures/bois/S-B4.jpg', title: 'Palmier',  description: 'description', artiste: 'Kalidou Kassé', prix:"$12" },
// { source: '/assets/img/sculptures/bois/S-B5.jpg', title: 'Dessert',  description: 'description', artiste: 'Kalidou Kassé', prix:"$20" }
// ];

@Component({
  selector: 'app-sculptures',
  templateUrl: './sculptures.component.html',
  styleUrls: ['./sculptures.component.css'],
  providers: [NgbCarouselConfig]
})
export class SculpturesComponent implements OnInit, OnChanges {

  sousMenuItems: any[];
  oeuvres$: Observable<any>;
  selectedTaxonIds$: Observable<number[]>;
  theme:any;
  themes:any;
  isclicked:number;
  // bois: any[];
  idTechnique: number;
  actionsSubscription: Subscription;
  idMenu:number;
  technique:Technique;

  constructor(private route: ActivatedRoute, config: NgbCarouselConfig, private store: Store<AppState>, private actions: ArticleActions,
    private actionsSearch: SearchActions, private ref: ChangeDetectorRef,private oeuvreS:OeuvreService) {
    this.isclicked=0;
    this.actionsSubscription = this.route.params.subscribe(
      (params: any) => {
        this.idMenu = params['id'];
        this.oeuvreS.getTechniqueByMenu(this.idMenu).subscribe(
          (response)=>{
            this.technique=<Technique>response;
            this.idTechnique=this.technique.id;
            //console.log('id sculpture: ' + this.idTechnique);
           // this.store.dispatch(this.actions.getAllProducts(this.idTechnique));
          });
        this.oeuvres$ = this.store.select(getProducts);
        this.selectedTaxonIds$ = this.store.select(getSelectedTaxonIds);
      });
  }

  ngOnInit() {
    this.onGetheme();
    this.sousMenuItems = SOUS_MENUS.filter(sousMenuItem => sousMenuItem);
  }

  ngOnChanges() {
  }
  sousMenuSelected(sousmenu) {
    //console.log('sous menu check : ' + sousmenu.id);
    if (sousmenu.id === 0) {
      this.store.dispatch(this.actionsSearch.clearFilter());
    } else if (sousmenu.id > 0) {
      this.store.dispatch(this.actionsSearch.clearFilter());
      this.store.dispatch(this.actionsSearch.addFilter(sousmenu));
    }
  
  }
  onGetheme(){
    this.oeuvreS.getTheme().subscribe(
      response=>{
        this.themes=response;
        //console.log('Mes thémes',this.themes)
      }
    );
  }
  onGetOeuvreFiltreByTheme(idtheme:number){
    this.oeuvreS.getOeuvreByTechniqueAndTheme(this.idTechnique,idtheme).subscribe(
      (data)=>{
        this.theme=data;
        this.isclicked=1;
        //console.log('filtre par théme',this.theme);
        this.ref.detectChanges();
      },
      (error)=>{
       //console.log(error)
      }
    );
  }
  
  
}
