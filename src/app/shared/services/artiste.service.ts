
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageProfil } from '../modeles/artiste';
import { Souscription } from '../modeles/souscription';
import { environment } from '../../../environments/environment';

@Injectable()
export class ArtisteService extends  HttpService {

  /**
   * Creates an instance of ArtisteService.
   * @param {HttpClient} http
   *
   * @memberof ArtisteService
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
   * @memberof ArtisteService
   */
  getArtiste(id: number): Observable<any> {
    return this.get(environment.API_ENDPOINT + `artiste/${id}`);
  }
  getArtisteByUser(idUser :number):Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `artiste/user/${idUser}`); 
  }
  addFormation(formation): Observable<any>{
    return this.post(environment.API_ENDPOINT+`formation`,formation)
  }
  getAnnoncesByArtiste(idArtiste : number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `annonce/artiste/${idArtiste}`);
  }

  getBiographie(idBiographie : number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `biographie/${idBiographie}`);
  }

  getAllBiographie(idArtiste : number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `biographie/artisteAll/${idArtiste}`);
  }

  getSouscription(): any {
    return this.http.get(environment.API_ENDPOINT + `souscription`);
  }
  
  addSouscription(souscription: Souscription): any{
    return this.post(environment.API_ENDPOINT+`souscription`,souscription)
  }
  deleteSouscription(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `souscription/${id}`);
    
  }

  addExposition(): Observable<any>{
    let exposition={}
    return this.post(environment.API_ENDPOINT+`exposition`,exposition);
  }

  addBiographie(biographie){
    
    return this.post(environment.API_ENDPOINT+`biographie`,biographie);
  }


  onAddExposition(exposition): Observable<any>{
    return this.post(environment.API_ENDPOINT+`exposition`,exposition);
  }
  /**
   *
   *
   * @returns {*}
   *
   * @memberof ArtisteService
   */
  getArtistes(): any {
    return this.http.get(environment.API_ENDPOINT + `artiste`);
  }

  putArtiste(idArtiste: number, artiste){
    return this.put(environment.API_ENDPOINT+`artiste/${idArtiste}`,artiste);

  }

  putPhotoArtiste(idArtiste: number, photoProfil: ImageProfil){
    return this.http.put(environment.API_ENDPOINT+`artiste/updatePhoto/${idArtiste}`,photoProfil);

  }

  getPresentation(idArtiste : number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `presentation/artiste/${idArtiste}`);
  }

  getAllPresentation(idArtiste : number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `/presentation/artisteAll/${idArtiste}`);
  }

  addPresentation(presentation){
    
    return this.post(environment.API_ENDPOINT+`presentation`,presentation);
  }

  deletePresentation(idPresentation: number){
    return this.delete(environment.API_ENDPOINT+`presentation/${idPresentation}`);
  }

  findArtisteByEmail(mail: string){
    return this.http
                  .get(`${environment.API_ENDPOINT}/souscription/mail/${mail}`)
  }
}
