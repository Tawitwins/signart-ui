
import {of as observableOf,  Observable ,  Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/**
 * Http Intercepter Service
 * TODO: Add Loader and Toasty Service currently using console log 
 * for showing errors and response and request completion;
 */
import { Injectable } from '@angular/core';
// import {
//   Http,
//   ConnectionBackend,
//   RequestOptions,
//   RequestOptionsArgs,
//   Response,
//   Headers,
//   Request
// } from '@angular/http';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
// import { environment }  'envifromronments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    // 'Content-Type': 'application/json; charset=utf-8'
    'Content-Type': 'application/json'
  })
};
declare var $: any;

@Injectable()
export class HttpService {
  public loading = new Subject<{loading: boolean, hasError: boolean, hasMsg: string}>();

  constructor(public http: HttpClient) {
  }

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  get<T>(url: string) {
    this.requestInterceptor();
    return this.http.get(this.getFullUrl(url), httpOptions)
    .pipe(
      catchError(this.handleError('get', []))
    );
  }

  // getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
  //   return super.get(url, options);
  // }

  /**
   * Performs a request with `post` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  post<T>(url: string, body: T, options?: any) {
    this.requestInterceptor();
    return this.http.post(this.getFullUrl(url), body, this.requestOptions(options))
    .pipe(
      catchError(this.handleError('post', body))
    );
  }

  /**
   * Performs a request with `put` http method.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<>}
   */
  put<T>(url: string, body: T) {
    this.requestInterceptor();
    return this.http.put(this.getFullUrl(url), body, httpOptions)
    .pipe(
      catchError(this.handleError('put', body))
    );
  }

  /**
   * Performs a request with `delete` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  delete <T> (url: string) {
    this.requestInterceptor();
    return this.http.delete(this.getFullUrl(url), httpOptions)
    .pipe(
      catchError(this.handleError('delete'))
    );
  }


  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(options?: any): any {
    if (options == null) {
      options = httpOptions;
    }

    if (options.headers == null) {
      const user = localStorage.getItem('user') != "undefined" ? JSON.parse(localStorage.getItem('user')) : null;
      options.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Spree-Token': user && user.spree_api_key
      });
    }
    return options;
  }

  /**
   * Build API url.
   * @param url
   * @returns {string}
   */
  private getFullUrl(url: string): string {
    return url;
  }

  /**
   * Request interceptor.
   */
  private requestInterceptor(): void {
    //console.log('Sending Request');
    // this.loaderService.showPreloader();
    this.loading.next({
      loading: true, hasError: false, hasMsg: ''
    });
  }

  /**
   * Response interceptor.
   */
  private responseInterceptor(): void {
    //console.log('Request Complete');
    // this.loaderService.hidePreloader();
  }

  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    //console.log('Something went terrible wrong and error is', error);
    $.notify({
      icon: "notifications",
      message: "Une erreur est survenue lors de l'exécution de la requête! veuillez réessayer!"
    }, {
        type: 'danger',
        timer: 2000,
        placement: {
          from: 'top',
          align: 'center'
        }
      });
    // this.loaderService.popError();
    return observableOf(error);
  }

  /**
   * onSubscribeSuccess
   * @param res
   */
  private onSubscribeSuccess(res: Response): void {

    this.loading.next({
      loading: false, hasError: false, hasMsg: 'OK'
    });
  }

  /**
   * onSubscribeError
   * @param error
   */
  private onSubscribeError(error: any): void {
    //console.log('Something Went wrong while subscribing', error);
    // this.loaderService.popError();

    this.loading.next({
      loading: false, hasError: true, hasMsg: 'Something went wrong'
    });
  }

  /**
   * onFinally
   */
  private onFinally(): void {
    this.responseInterceptor();
  }

  /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        // TODO: better job of transforming error for user consumption
        //console.log(`${operation} failed: ${error.message}`);
  
        // Let the app keep running by returning an empty result.
        return observableOf(result as T);
      };
    }
}
