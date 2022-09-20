
// import {throwError as observableThrowError,  Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';


// @Injectable()
// export class generic {
//     //A remplacer par localStorage.getItem("user").token
//     // public token:string = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJpZFwiOjIsXCJ1c2VyTmFtZVwiOlwic2xvbVwiLFwiZmlyc3ROYW1lXCI6XCJTaWR5XCIsXCJsYXN0TmFtZVwiOlwiTE9NXCIsXCJlbWFpbFwiOlwic2lkeS5sb21AZ21haWwuY29tXCIsXCJ1c2VyVHlwZVwiOlwiYWRtaW5cIixcInJvbGVzXCI6W1wiQWRtaW5cIl0sXCJvbGRBY2NvdW50XCI6ZmFsc2V9IiwiaXNzIjoiYWNjb3VudC1tYW5hZ2VtZW50LWZ1ZHBlIn0._sBKE3uksoy8z5JWAd9cMoUc9P4hllylhj5xL5ikTpo';


//     //Create constructor to get Http instance
//     constructor(public http: Http) {
//     }

//     getAll<T>(url: string): Observable<T> {
//         // let cpHeaders = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authentificationService.getToken() });
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.get(url, options)
//             .map((response: Response) => this.extractData(response))
//             .catch(this.handleError);
//     }


//     create<T>(url: string, body: T): Observable<number> {
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.post(url, body, options)
//             .map(success => success.status)
//             .catch(this.handleError);
//     }

//     add<T>(url: string, body: T): Observable<T> {
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.post(url, body, options)
//             .map((response: Response) => this.extractData(response))
//             .catch(this.handleError);
//     }

//     update<T>(url: string, id: any, entite: T): Observable<number> {
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.put(url + "/" + id, entite, options)
//             .map(success => success.status)
//             .catch(this.handleError);
//     }


//     delete<T>(url: string, identifiant: any): Observable<T> {
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.delete(url + "/" + identifiant, options)
//             .map(success => success.status)
//             .catch(this.handleError);
//     }


//     getById<T>(url: string, id: any): Observable<T> {
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.get(url + "/" + id, options)
//             .map((response: Response) => <T>this.extractData(response))
//             .catch(this.handleError);
//     }

//     findwithParameter<T>(url: string, parameter: string): Observable<T> {
//         let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
//         let options = new RequestOptions({ headers: cpHeaders });
//         return this.http.get(url + parameter, options)
//             .map((response: Response) => <T>this.extractData(response)).delay(1000)
//             .catch(this.handleError);
//     }

//     findByJoin<T>(url: string, parameter: string[]): Observable<T> {
//         let param = '';
//         parameter.forEach(element => {
//             param += '/' + element;
//         });
//         return this.findwithParameter(url, param);
//     }


//     extractData(res: Response) {
//         let body = res.json();
//         return body;
//     }
//     extractUrl(res: Response) {
//         return res;
//     }

//     extractDataBlob(res: Response) {
//         let body = res.blob();
//         return body;
//     }

//     handleError(error: Response | any) {
//         // console.error(error.message || error);
//         return observableThrowError(error.status);
//     }

//     handleErrorJson(error: Response | any) {
//         let body = error.json();
//         return body;
//     }
// }