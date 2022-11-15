import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public keyLanguage = 'userLanguage';
  private _userLanguage = '';

  private supportedLanguages = ['GBR', 'fr'];
  public languageCodeList:string[] = ['fr', 'GBR']
  public languages = [
    {
      name: "English",
      code: "GBR"
    },
    {
      name: "Français",
      code: "fr"
    }
  ]
  constructor( 
    private translate: TranslateService,
    private http: HttpClient
    ) {
    this.initLanguage();
    this.translate.use(this._userLanguage);
   }
  
  initLanguage(){
    const value = localStorage.getItem(this.keyLanguage);
    if(value != null){
      this._userLanguage = value;
    } else {
        const browserLanguage = navigator.language.split('-')[0];
        this._userLanguage = 'GBR';

        if(this.supportedLanguages.includes(browserLanguage)) {
          this._userLanguage = browserLanguage;
          localStorage.setItem(this.keyLanguage, browserLanguage);
        }
      }
  }

  setLanguage(language: any){
    this._userLanguage = language;
    localStorage.setItem(this.keyLanguage, this._userLanguage);
    this.translate.use(this._userLanguage);
  }

  get userLanguage(){
    return this._userLanguage;
  }

  getAvailableLanguages() {
    return this.supportedLanguages;
  }

  getFlagCountry(code: string){
    return this.http.get(`${environment.flagCountry_url}/${code}`)
  }
}
