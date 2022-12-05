import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class MagasinService extends HttpService {

  constructor(public http: HttpClient) {
    super(http);
   }
    /**
   *
   *
   * @param {string} id
   * @returns {Observable<any>}
   *
   * @memberof MagasinService
   */
     getAllMagasins(): any {
      return this.http.get(environment.API_ENDPOINT + `magasin`);
    }
}
