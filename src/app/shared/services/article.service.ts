
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
// import { RequestOptions, RequestOptionsArgs, Headers, ResponseContentType, Http } from '@angular/http';
import { Oeuvre } from '../modeles/oeuvre';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { FavoriteActions } from '../../wishlist/actions/favorite.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


declare var $: any;

@Injectable()
export class ArticleService extends HttpService{

  /**
   * Creates an instance of ArticleService.
   * @param {HttpService} http
   *
   * @memberof ArticleService
   */
  constructor(public http: HttpClient, private http2: HttpClient, private store: Store<AppState>, private actions: FavoriteActions) {
    super(http);
  }

  /**
   *
   *
   * @param {number} id
   * @returns {Observable<any>}
   *
   * @memberof ArticleService
   */
  getArticle(id: number): Observable<any> {
    return this.get(environment.API_ENDPOINT + `oeuvre/${id}`);
  }

  getImage(id: number): Observable<Blob> {
    // let options = new RequestOptions({ responseType:ResponseContentType.Blob});
    return this.http2.get(environment.API_ENDPOINT + `image/oeuvre/${id}`, { responseType: 'blob' })
      .pipe(map(
        // Log the result or error
        data => data,
        error => observableThrowError(error.status)
      ));
  }
  getImageSouscription(id: number): Observable<Blob> {
    // let options = new RequestOptions({ responseType:ResponseContentType.Blob});
    return this.http2.get(environment.API_ENDPOINT + `image/oeuvreSouscription/${id}`, { responseType: 'blob' })
      .pipe(map(
        // Log the result or error
        data => data,
        error => observableThrowError(error.status)
      ));
  }

  /*getImage(id: number): Observable<any> {
    // let options = new RequestOptions({ responseType:ResponseContentType.Blob});
    return this.http.get(environment.API_ENDPOINT + `image/oeuvre/${id}`);

  }*/


  /**
   *
   *
   * @returns {*}
   *
   * @memberof ArticleService
   */
  getTaxonomies(): any {
    return this.get(`/spree/api/v1/taxonomies?set=nested`);
  }

  /**
   *
   *
   * @returns {*}
   *
   * @memberof ArticleService
   */
  getAllArticles(): any {
    return this.get(environment.API_ENDPOINT + `oeuvre`);
  }
  getArticles(id: number): any {
    return this.get(environment.API_ENDPOINT + `oeuvre/technique/${id}`);
  }

  getNouveauxOeuvres(){
    return this.get<Oeuvre[]>(environment.API_ENDPOINT + `oeuvre/nouveau`);
  }

  createNewWishItem(idOeuvre: number) {
    return this.post(environment.API_ENDPOINT +
      `marquageoeuvre`,
      {
        idOeuvre: idOeuvre,
        codeTypeMarquage: environment.MarquageFavori,
        idClient:JSON.parse(localStorage.getItem('client')).id,
        dateMarquage: new Date()
      }
    ).pipe(map(res => {
      $.notify({
        icon: "notifications",
        message: "Oeuvre ajoutée à la liste des favoris"
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
          message: "Erreur ajout oeuvre"
        }, {
            type: 'danger',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        return null;
      }));
  }

  getAllWishlist(id: number) {
    return this.get<Oeuvre[]>(environment.API_ENDPOINT + `oeuvre/marque/FAV/${id}`);
  }

  deleteFromWishlist(idClient: number, idOeuvre: number, codeTypeMarquage: string) {
    return this.delete(environment.API_ENDPOINT + `marquageoeuvre?idClient=${idClient}&idOeuvre=${idOeuvre}&codeTypeMarquage=${codeTypeMarquage}`).pipe(
      map(() => {
        this.store.dispatch(this.actions.removeWishItemSuccess(idOeuvre));
        $.notify({
          icon: "notifications",
          message: "Oeuvre retirée de la liste favorite."
        }, {
            type: 'success',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
      }));
  }
}
