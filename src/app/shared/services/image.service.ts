
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
//import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { OeuvreNumerique } from '../modeles/imageNumerique';
import { Abonne, ListSelection, ListeSelection_Oeuvres, Abonnement, Email, Terminal } from '../modeles/utilisateur';
import { environment } from '../../../environments/environment';
//import { environment } from 'src/environments/environment';

@Injectable()
export class ImageService extends  HttpService {

  /**
   * Creates an instance of ImageService.
   * @param {HttpClient} http
   *
   * @memberof ArtisteService
   */
  constructor(public http: HttpClient) {
    super(http);
  }

  addImage(image): Observable<any>{
    return this.http.post(environment.API_ENDPOINT+`image/upload`,image, {
      reportProgress: true,
      observe: 'events'
    });
  }

  saveImage(image: OeuvreNumerique): Observable<any>{
    return this.http.post(environment.API_ENDPOINT+`numerique/output`,image);
  }

  getAllPays(): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `pays/all`);
  }
  sendMail(email: Email): Observable<any>{
    return this.http.post(environment.API_ENDPOINT+`admin/sendMail`,email);
  }

  getCodeByAbonne(idAbonne: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `codeSignart/findByIdAbonne/${idAbonne}`);
  }

  getAllListeByUser(idUser: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `listeSelection/allUserListe/${idUser}`);
  }

  getListeByName(nomListe: string): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `listeSelection/name/${nomListe}`);
  }

  getClientByUser(idUser: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `client/user/${idUser}`);
  }

  getAllCientAdresse(idClient: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `adresse/client/${idClient}`);
  }


  getPersonne(id: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `personne/${id}`);
  }

  getImage(imageName: string): Observable<any>{
    return this.http.get(environment.API_ENDPOINT + `numerique/load/${imageName}`);
  }

  getAllImage(): Observable<any>{
    return this.http.get(environment.API_ENDPOINT + `numerique/loadAll`);
  }

  getArtisteImageUrl(id: number) {
    return environment.API_ENDPOINT + 'numerique/load/' + id;
}

getImageTest(id: number): Observable<Blob> {
    // let options = new RequestOptions({ responseType:ResponseContentType.Blob});
    return this.http.get(environment.API_ENDPOINT + `numerique/load/${id}`, { responseType: 'blob' })
      .pipe(map(
        // Log the result or error
        data => data
      ));
  }

getAllTerminal(): Observable<any>{
  return this.http.get(environment.API_ENDPOINT + `terminal/getAll`);
}


getAllDelai(): Observable<any>{
  return this.http.get(environment.API_ENDPOINT + `delai/getAll`);
}

getAllEtat(): Observable<any>{
  return this.http.get(environment.API_ENDPOINT + `etatAbonnement/getAll`);
}

getUtilisateur(id: number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `utilisateur/${id}`);
}

addAbonne(abonne: Abonne): Observable<any>{
  return this.http.post(environment.API_ENDPOINT+`abonne`,abonne);
}

getAbonne(idUtilisateur : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `abonne/utilisateur/${idUtilisateur}`);
}

getAllAbonne(idUser : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `abonne/getAllAbonne/${idUser}`);
}

getAllHistoriqueAbonnement(idUser : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `historiqueAbonnement/utilisateur/${idUser}`);
}

getAbonneByListe(idListeSelection : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `abonne/listeSelection/${idListeSelection}`);
}

getAbonnement(idAbonne : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `abonnement/abonnementByAbonne/${idAbonne}`);
}

getAbonnementById(idAbonnement : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `abonnement/${idAbonnement}`);
}
updateAbonnement(abonnement: Abonnement): Observable<any>{
  return this.http.put(environment.API_ENDPOINT+`abonnement`,abonnement)
}

addListe(liste: ListSelection): Observable<any>{
  return this.http.post(environment.API_ENDPOINT+`listeSelection`,liste)
}

getListe(idUtilisateur : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `listeSelection/utilisateur/${idUtilisateur}`);
}

addListeImage(listeImg: ListeSelection_Oeuvres): Observable<any>{
  return this.http.post(environment.API_ENDPOINT+`listeSelectionImage`,listeImg)
}

addAbonnement(abonnement: Abonnement): Observable<any>{
  return this.http.post(environment.API_ENDPOINT+`abonnement`,abonnement)
}

addListOeuvre(listoeuvre: ListeSelection_Oeuvres): Observable<any>{
  return this.http.post(environment.API_ENDPOINT+`listeSelectionImage`,listoeuvre)
}

getTechnique(){
  return this.http.get(environment.API_ENDPOINT + `technique/getAll`);
}

getAllArtiste(): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `artiste`);
}

getAbonneById(idAbonne : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `abonne/${idAbonne}`);
}

getEtatById(idEtat : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `etatAbonnement/${idEtat}`);
}
getTerminalById(idTerminal : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `terminal/${idTerminal}`);
}
getDelaiById(idDelai : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `delai/${idDelai}`);
}
getListeById(idListe : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `listeSelection/${idListe}`);
}
getListeOeuvre(idListe : number):  Observable<any>{
  return this.http.get(environment.API_ENDPOINT + `listeSelectionImage/listeOeuvre/${idListe}`);
}



/*getFormation(idArtiste : number): Observable<any> {
  return this.http.get(environment.API_ENDPOINT + `formation/artiste/${idArtiste}`);
}

addFormation(formation: Formation): Observable<any>{
  return this.post(environment.API_ENDPOINT+`formation`,formation)
}*/

reabonnement(oldAbonnementdto: Abonnement, terminalResponse: boolean, terminal: Terminal): Observable<any>{
  return this.http.post(environment.API_ENDPOINT + `abonnement/reabonnement/${terminalResponse}/${terminal.id}`,oldAbonnementdto);
}
  


}
