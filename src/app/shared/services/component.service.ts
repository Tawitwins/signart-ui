
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
// import { RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ComponentService {

//   constructor(public http:Http) {
//       super(http);
//    }

//   getMenus(): Observable<RouteInfo[]> {
//     return this.getAll(environment.API_ENDPOINT + 'menu');
//   }

 /**
   * Creates an instance of ArticleService.
   * @param {HttpService} http
   *
   * @memberof ArticleService
   */
  constructor(private http: HttpService) { }

  /**
   *
   *
   * @returns {*}
   *
   * @memberof ArticleService
   */
  getMenus(): any {
    return this.http.get(environment.API_ENDPOINT +`menu`).pipe(
    map(res => res));
  }
  getAllMenus(){
    return this.http.get(environment.API_ENDPOINT +`menu/all-menus`)
  }

}