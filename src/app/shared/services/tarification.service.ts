import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class TarificationService extends HttpService {

  constructor(public http: HttpClient) {
    super(http);
   }
    /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof TarificationService
   */
     getAllTarifications(): any {
      return this.http.get(environment.API_ENDPOINT + `tarification`);
    }
}
