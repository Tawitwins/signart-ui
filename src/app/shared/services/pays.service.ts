
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
// import { RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaysService extends HttpService{

  /**
   * Creates an instance of PaysService.
   * @param {HttpClient} http
   *
   * @memberof PaysService
   */
  constructor(public http: HttpClient) {
    super(http);
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<any>}
   *
   * @memberof PaysService
   */
  getPays(id: number): Observable<any> {
    return this.get(environment.API_ENDPOINT + `pays/${id}`);
  }


  /**
   *
   *
   * @returns {*}
   *
   * @memberof PaysService
   */
  getAllPays(): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `pays/all`);
  }
}
