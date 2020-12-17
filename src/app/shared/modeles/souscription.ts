import { Oeuvre } from './oeuvre';
export class Souscription {
  id:number;
  nom:String;
  prenom:String;
  email:String;
  telephone:String;
  sexe:String;
  codePays:String;
  siteWeb:String;
  specialites:String;
  nomGalerie:String;
  adresseGalerie:String;
  ville:String;
  formation:String;
  exposition:String;
  oeuvres:Oeuvre[];
}