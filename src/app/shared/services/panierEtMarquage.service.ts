
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
  constructor(public http: HttpClient,private authService:AuthServiceS,private toastr:ToastrService, private http2: HttpClient, private store: Store<AppState>, 
    //private actions: FavoriteActions
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
        this.toastr.success("Oeuvre ajoutée au panier","Succés");
        // const panier: Panier = res.json();
        return <any>res;
      } else {
        this.toastr.success("Erreur ajout oeuvre","Erreur");
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
        this.toastr.success("Échec ajout oeuvre","Échec");
        console.log(error);
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
}
