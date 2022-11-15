import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from './http';

@Injectable({
  providedIn: 'root'
})
export class EvenementSignartService extends  HttpService {

  constructor(public http: HttpClient) { 
    super(http);
  }
  getAllEvenement(): Observable<any> {
    return this.get(environment.API_ENDPOINT + `evenementSignart/`);
    
  }
}
