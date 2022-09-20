import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ExpositionService extends  HttpService {

  /**
   * Creates an instance of ArtisteService.
   * @param {HttpClient} http
   *
   * @memberof ExpositionService
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
   * @memberof ExpositionService
   */
  getExpositionByArtiste(id: number): Observable<any> {
    return this.get(environment.API_ENDPOINT + `exposition/artiste/${id}`);
  }
   
   }