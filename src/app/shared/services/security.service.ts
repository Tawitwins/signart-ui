import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SecurityService  {

  BASE_URL: string = environment.API_ENDPOINT+"secure"

  constructor( private http: HttpClient,) { }

  encryptAndSetToLocalStorage(key:string, data:any){
    let plain = JSON.stringify(data)
    return this.http
          .post(`${this.BASE_URL}/encrypt`,plain, {responseType: "text"})
              .subscribe(
                      cipher => {
                        localStorage.setItem(key, cipher)
                      })
  }
  
  decryptAndGetFromLocalStorage(key:string): any{
    let cipher = localStorage.getItem(key)
    return this.http
            .post(`${this.BASE_URL}/decrypt`, cipher)
 }
}
