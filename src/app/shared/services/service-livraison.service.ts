import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class ServiceLivraisonService  extends HttpService {

  constructor(public http: HttpClient) {
    super(http);
   }
    /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof ServiceLivraisonService
   */
     getAllServiceLivraisons(): any {
      return this.http.get(environment.API_ENDPOINT + `serviceLivraison`);
    }
}
