
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
// import { RequestOptions, RequestOptionsArgs, Headers, ResponseContentType, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Oeuvre } from '../modeles/oeuvre';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
//import { FavoriteActions } from '../../wishlist/actions/favorite.actions';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Visiteur } from '../modeles/visiteur';


declare var $: any;

@Injectable()
export class VisiteurService extends HttpService{

  /**
   * Creates an instance of VisiteurService.
   * @param {HttpService} http
   *
   * @memberof VisiteurService
   */
  constructor(public http: HttpClient, private http2: HttpClient, private store: Store<AppState>, 
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
  getVisiteur(id: number): Observable<any> {
    return this.get(environment.API_ENDPOINT + `Visiteur/${id}`);
  }
  getAllVisiteur(): Observable<any> {
    return this.get(environment.API_ENDPOINT + `Visiteur/`);
  }

  createVisiteur(visiteur: Visiteur) {
    // let options = new RequestOptions({ responseType:ResponseContentType.Blob});
    //console.log("on va faire appel à  l'api");
    //visiteur.id=null;
    return this.post(environment.API_ENDPOINT + `Visiteur`,visiteur
    )/*.subscribe(
      (val) => {
          //console.log("POST call successful value returned in body", 
                      val);
      },
      response => {
          //console.log("POST call in error", response);
      },
      () => {
          //console.log("The POST observable is now completed.");
      })*/;
      
    /*.pipe(map(res => {
      $.notify({
        icon: "notifications",
        message: "Votre identification a réussi"
      }, {
          type: 'success',
          timer: 2000,
          placement: {
            from: 'top',
            align: 'center'
          }
        });
      return res;
    },
      error => {
        $.notify({
          icon: "notifications",
          message: "Erreur lors de votre identification"
        }, {
            type: 'danger',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        return null;
      }));*/
  }
}
