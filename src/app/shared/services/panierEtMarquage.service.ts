
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { LignePanier } from '../modeles/ligne_panier';
import { environment } from '../../../environments/environment';
import { Panier } from '../modeles/panier';
import { Oeuvre } from '../modeles/oeuvre';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceS } from './auth.service';
import { OeuvreNumerique } from '../modeles/imageNumerique';
import { Suivre } from '../modeles/suivre';
import { TranslateService } from '@ngx-translate/core';
//import { Suivre } from '../modeles/suivre';
declare var $: any;


@Injectable()
export class PanierEtMarquageService extends HttpService{
  client: any;

  /**
   * Creates an instance of VisiteurService.
   * @param {HttpService} http
   *
   * @memberof PanierEtMarquageService
   */
  constructor(
    public http: HttpClient,
    private authService:AuthServiceS,
    private toastr:ToastrService, 
    private http2: HttpClient, 
    private store: Store<AppState>, 
    //private actions: FavoriteActions,
    private translate: TranslateService
    ) {
    super(http);
  }

  /**
   *
   *
   * @param {number} id
   * @returns {Observable<any>}
   *
   * @memberof VisiteurService
   */
  getWishList(idClient){
    return this.get(environment.API_ENDPOINT+`marquageoeuvre/client/${idClient}`);
  }
  postWishlistItem(WishItem){
    return this.post(environment.API_ENDPOINT+`marquageoeuvre/`, WishItem);
  }
  deleteWishlistItem(idOeuvre,idClient,codeTypeMarquage){
    return this.delete(environment.API_ENDPOINT+`marquageoeuvre?idClient=${idClient}&idOeuvre=${idOeuvre}&codeTypeMarquage=${codeTypeMarquage}` );
  }
  getPanierByIdClient(idClient){
    return this.get(environment.API_ENDPOINT+`panier/client/${idClient}`);
  }
  getLineItems() {
    return this.get<LignePanier[]>(environment.API_ENDPOINT + `lignepanier`);
  }
  getLineItemsByClient(idClient:number) {
    return this.get<LignePanier[]>(environment.API_ENDPOINT + `lignepanier/client/${idClient}`);
  }
  createNewLineItem(oeuvre: Oeuvre) {
    this.client = this.authService.getClientConnected();
    console.log(oeuvre)
    return this.post(environment.API_ENDPOINT +
      `lignepanier`,
      {
        oeuvre: {
          id: oeuvre.id
        },
        quantite: 1,
        prix: oeuvre.prix,
        total: oeuvre.prix,
        idClient: this.client.id
      }
    ).pipe(map(res => {
      if (res) {
        /* $.notify({
          icon: "notifications",
          message: "Oeuvre ajoutée au panier"
        }, {
          type: 'success',
          timer: 2000,
          placement: {
            from: 'top',
            align: 'center'
          }
        }); */
        this.translate.get('PopupOeuvAddedAtCart').subscribe(popup => {
            this.translate.get('SUCCESS').subscribe(alertType => {
              this.toastr.success(popup, alertType);
            })
          })
        // this.toastr.success("Oeuvre ajoutée au panier","Succès");
        // const panier: Panier = res.json();
        return <any>res;
      } else {
        this.translate.get('PopupOeuvAddedError').subscribe(popup => {
          this.translate.get('ERROR').subscribe(alertType => {
            this.toastr.error(popup, alertType);
          })
        })
        // this.toastr.success("Erreur ajout oeuvre","Erreur");
        /* $.notify({
          icon: "notifications",
          message: "Erreur ajout oeuvre"
        }, {
          type: 'danger',
          timer: 2000,
          placement: {
            from: 'top',
            align: 'center'
          }
        }); */
        return null;
      }

    },
      error => {
        this.translate.get('PopupOeuvAddedFailed').subscribe(popup => {
          this.translate.get('FAILED').subscribe(alertType => {
            this.toastr.error(popup, alertType);
          })
        })
        // this.toastr.success("Échec ajout oeuvre","Échec");
        console.log(error);
        /* $.notify({ FAILED
          icon: "notifications",
          message: "Erreur ajout oeuvre"
        }, {
          type: 'danger',
          timer: 2000,
          placement: {
            from: 'top',
            align: 'center'
          }
        }); */
      }));
  }

  
  deleteLineItem(lignePanier){
    return this.delete(environment.API_ENDPOINT + `lignepanier/${lignePanier.id}`)
  }
  getPanierItems(idClient: number): any {
    return this.get(environment.API_ENDPOINT + `panier/client/${idClient}`);
  }

  createPanierItems(panier: Panier): any {
    return this.post(environment.API_ENDPOINT + `panier`,panier);
  }
  updateLigneItems(lignePanier){
    return this.put(environment.API_ENDPOINT + `lignepanier/${lignePanier.id}`,lignePanier)
  }


  getListClientByArt(idArtiste:number){
    console.log('List des clients qui suivent le artist: '+idArtiste);
    return this.http.get(environment.API_ENDPOINT + `marquageartiste/ListClientByArt/${idArtiste}`);
  }
  getListVisiteurByArt(idArtiste:number){
    console.log('List des visiteurs qui suivent le artist: '+idArtiste);
    return this.http.get(environment.API_ENDPOINT + `marquageartiste/ListVisiteurByArt/${idArtiste}`);
  }
  getMarquageByArtiste(idClient: number, idArtiste:number, codeTypeMarquage:string):Observable<any>{
      console.log('marquage');
      return this.http.get(environment.API_ENDPOINT + `marquageartiste/marquage?idClient=${idClient}&idArtiste=${idArtiste}&codeTypeMarquage=${codeTypeMarquage}`);
  }

  suivreArtiste(suis: Suivre) {
      console.log('suivre ' + suis);
      return this.http.post(environment.API_ENDPOINT + `marquageartiste`, suis);
  }

  plusSuivreArtiste(idClient: number, idArtiste:number, codeTypeMarquage:string) {
      return this.http.delete(environment.API_ENDPOINT + `marquageartiste?idClient=${idClient}&idArtiste=${idArtiste}&codeTypeMarquage=${codeTypeMarquage}`);
      
  }
  plusSuivreArtisteByVisiteur(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `marquageartiste/${id}`);
    
  }
  getClientByUser(id: number) {
    console.log('un client');
    return this.http.get(environment.API_ENDPOINT + `client/user/${id}`)
  }
}
