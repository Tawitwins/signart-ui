
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
// import { RequestOptions, RequestOptionsArgs, Headers, ResponseContentType, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Suivre } from '../modeles/suivre';
import {Newsletter} from '../modeles/newsletter';
import { HttpClient } from '@angular/common/http';
import { Oeuvre } from '../modeles/oeuvre';
import { Annonce } from '../modeles/exposition';

declare var $: any;

@Injectable()
export class OeuvreService extends  HttpService {

    /**
     * Creates an instance of OeuvreService.
     * @param {HttpService} http
     *
     * @memberof OeuvreService
     */
    constructor(public http: HttpClient) {
      super(http);
    }
    getOeuvreByArtiste(id: number): Observable<any>{
        console.log('oeuvre');
        return this.http.get(environment.API_ENDPOINT + `oeuvre/artiste/${id}`);
    }
    getFirstOeuvreByArtiste(id: number): any{
      console.log('oeuvre');
      return this.http.get(environment.API_ENDPOINT + `oeuvre/artiste/First/${id}`);
    }
    getOeuvreSouscriptionByArtiste(id: number): Observable<any>{
      console.log('oeuvreSouscription');
      return this.http.get(environment.API_ENDPOINT + `oeuvreSouscription/artiste/${id}`);
  }
    getOeuvreByTechniqueAndTheme(id:number,nb:number){
       return this.get(environment.API_ENDPOINT + `oeuvre/technique/by-theme/${id}/${nb}`)
    }
    getSousTechniqueByTechnique(id:number){
      return this.get(environment.API_ENDPOINT + `soustechnique/by-technique/${id}`)
    }
    getTechniqueByMenu(id:number){
      return this.http.get(environment.API_ENDPOINT + `technique/by-menu/${id}`);
    }
    getTechnique(){
      return this.http.get(environment.API_ENDPOINT + `technique/getAll`);
    }
    getTechniqueLibelleById(id:number){
      return this.http.get(environment.API_ENDPOINT + `technique/${id}`);
    }
    getSousTechnique(){
      return this.http.get(environment.API_ENDPOINT + `soustechnique`);
    }
    getMenus(){
      return this.http.get(environment.API_ENDPOINT +`menu/all-menus`)
    }
    getTheme(){
      return this.http.get(environment.API_ENDPOINT +`theme`)
    }

    getClientByUser(id: number) {
        console.log('un client');
        return this.http.get(environment.API_ENDPOINT + `client/user/${id}`)
    }

    getCommandeOfClient(idClient: number): Observable<any> {
      return this.http.get(environment.API_ENDPOINT + `commande/client/${idClient}`);
    }

    getGalerie(){
      return this.http.get(environment.API_ENDPOINT + `magasin`);
    }
   /* getVisiteurById(id: number) {
      console.log('un client');
      return this.http.get(environment.API_ENDPOINT + `client/user/${id}`)
  }*/
     /**
      * 
      * @param idClient 
      * @param idVisiteur 
      * @param idArtiste 
      * @param codeTypeMarquage 
      */
    getListClientByArt(idArtiste:number){
      console.log('List des clients qui suivent le artist: '+idArtiste);
      return this.http.get(environment.API_ENDPOINT + `marquageartiste/ListClientByArt/${idArtiste}`);
    }
    getListVisiteurByArt(idArtiste:number){
     // console.log('List des visiteurs qui suivent le artist: '+idArtiste);
      return this.http.get(environment.API_ENDPOINT + `marquageartiste/ListVisiteurByArt/${idArtiste}`);
    }
    getMarquageByArtiste(idClient: number, idArtiste:number, codeTypeMarquage:string):Observable<any>{
        console.log('marquage');
        return this.http.get(environment.API_ENDPOINT + `marquageartiste/marquage?idClient=${idClient}&idArtiste=${idArtiste}&codeTypeMarquage=${codeTypeMarquage}`);
    }

    suivreArtiste(suis: Suivre) {
        console.log('suivre ' + suis);
        return this.http.post(environment.API_ENDPOINT + `marquageartiste`, suis);
    }

    plusSuivreArtiste(idClient: number, idArtiste:number, codeTypeMarquage:string) {
        return this.http.delete(environment.API_ENDPOINT + `marquageartiste?idClient=${idClient}&idArtiste=${idArtiste}&codeTypeMarquage=${codeTypeMarquage}`);
        
    }
    plusSuivreArtisteByVisiteur(id: number) {
      return this.http.delete(environment.API_ENDPOINT + `marquageartiste/${id}`);
      
  }
    /*plusSuivreArtisteByVisiteur(idClient: number, idVisiteur: number,  idArtiste:number, codeTypeMarquage:string) {
      return this.http.delete(environment.API_ENDPOINT + `marquageartiste?idVisiteur=${idVisiteur}&idArtiste=${idArtiste}&codeTypeMarquage=${codeTypeMarquage}`);
      
  }*/
   
    newsletter(newsl: string) {
        console.log('newsletter ' + newsl);
        return this.http.post(environment.API_ENDPOINT + `newsletter/abonnement`, newsl).pipe(
        map(res => {
            $.notify({
              icon: 'notifications',
              message: 'Inscription réussie'
            }, {
                type: 'success',
                timer: 2000,
                placement: {
                  from: 'top',
                  align: 'center'
                }
              });
            return res;
          },
            error => {
              $.notify({
                icon: 'notifications',
                message: 'Verifier le format du mail'
              }, {
                  type: 'danger',
                  timer: 2000,
                  placement: {
                    from: 'top',
                    align: 'center'
                  }
                });
                return null;
            }));
    }

    getExpoByArtiste(id: number) {
        console.log('expo');
        return this.http.get(environment.API_ENDPOINT + `exposition/artiste/${id}`);
    }

    getFormationByArtiste(id: number) {
        console.log('formation');
        return this.http.get(environment.API_ENDPOINT + `formation/artiste/${id}`);
    }

    getAnnoceByArtiste(id: number) {
        console.log('annonce');
        return this.http.get(environment.API_ENDPOINT + `annonce/artiste/${id}`);
    }
    addAnnonce(annonce : Annonce){
      console.log('annonce');
        return this.http.post(environment.API_ENDPOINT + `annonce`, annonce);
    }

    getClientByArtiste(id: number) {
        console.log('client');
        return this.http.get(environment.API_ENDPOINT + `client/artiste/${id}`);
    }
    /**
     * 
     * @param id 
     */
    getArtisteByClient(idClient:number){
      console.log('artiste');
      return this.http.get(environment.API_ENDPOINT + `artiste/marque/SUIV/${idClient}`);
    }
    
    editOeuvreArtiste(oeuvre: Oeuvre){
      return this.http.put(environment.API_ENDPOINT + `oeuvre/${oeuvre.id}`, oeuvre);
    }
    addOeuvreSouscriptionArtiste(oeuvre: any){
      return this.http.post(environment.API_ENDPOINT + `oeuvreSouscription`, oeuvre);
    }

    addOeuvreArtiste(oeuvre: any){
      return this.http.post(environment.API_ENDPOINT + `oeuvre`, oeuvre);
    }


    deleteOeuvreById(id: number){
      return this.http.delete(environment.API_ENDPOINT + `oeuvre/${id}`);
    }
    getCouleur(){
      return this.http.get(environment.API_ENDPOINT + `couleur/getAll`);
    }

    getAllExpo():Observable<any> {
      return this.http.get(environment.API_ENDPOINT + `exposition/all`);
    }
    
}
