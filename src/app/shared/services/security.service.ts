import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService } from './http';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class SecurityService extends HttpService {
  secretKey :string = "SECRETKEYKEYSECR";
  iv :string = "encryptionIntVec";
  constructor(public http: HttpClient) {  
    super(http);
  }
  encryptAndSetToLocalStorage(key:string,data:any){
    let dt = JSON.stringify(data)
    console.log(dt);
    
    this.http.post(`${environment.API_ENDPOINT}secure/encrypt`,dt,{responseType:'text'}).subscribe(
                      cipher => {
                        console.log(cipher);
                        localStorage.setItem(key,<string>cipher);
                      }), 
                    (err)=>{
                      console.log(err);
                    }
  }
  
  decryptAndGetFromLocalStorage(key:string):string{
    let encStr = localStorage.getItem(key)
    this.http.post(`${environment.API_ENDPOINT}secure/decrypt`, encStr,{responseType:'text'})
              .subscribe( 
                plain => {
                  let clair = JSON.parse(<string>plain);
                  console.log(plain);
                  console.log(clair);
                  return plain;
                })
    return "";
  }
  encrypt(key: string,value : string) : string{  
      return this.encryptOnly(key,value);
  }

  decrypt(key : string): string{

      return this.decryptOnly(key);
    }

  encryptOnly(key,value){
      let valueString = JSON.stringify(value)
      let cipher = CryptoJS.AES.encrypt(valueString, this.secretKey,{
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7}).toString();
      localStorage.setItem(key,<string>cipher);
      return cipher
    }
    
  decryptOnly(key){
      let textToDecrypt = localStorage.getItem(key);

      return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey,{
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
  }
}