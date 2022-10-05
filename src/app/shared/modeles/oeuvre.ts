import { SafeUrl } from '@angular/platform-browser';
import { Technique } from './technique';
import { Couleur } from './couleur';

export type ItemColor = 'yellow' | 'red' | 'white';

export class Oeuvre {
  id?: number;
  nom?: string;
  image?: Blob;
  description?: string;
  prix?: number;
  taxes?: number;
  tauxremise?: number;
  fraisLivraison?: number;
  nouveau?: boolean;
  idCouleur?: Couleur;
  dimensions?: string;
  miniature?: Blob;
  idArtiste?: number;
  idStatus?: number;
  stock?: number;
  idTechnique?: number; // this.oeuvres.filter(oeuvre => oeuvre.paid)
  annee?: number;
  lithographie?: boolean;
  paid?: boolean = false;
  auteur?: string;
  dateAjout?: Date;
  currency?: string;
  artiste?: string;
  idSouscription?: number;
  Technique?: Technique;
  quantity?:number;
  specialDelivery?: boolean;
  constructor(/*id: number,
    nom: string,
    prix: number,
    currency: string,
    description: string,
    artiste: string,
    idCouleur: Couleur,
    image: Blob,
    nouveau: boolean,
    dimensions: string,
    tauxremise: number,
    taxes: number,
    lithographie: boolean,
    idTechnique: Technique,
    fraisLivraison: number,
    idArtiste: number,
    idSouscription: number,*/){}
}
export class OeuvreSousc {
  id?: number;
  nom?: string;
  idTechnique?: number;
  idCouleur?: Couleur;
  nouveau?: boolean;
  lithographie?: boolean;
  auteur?: string;
  dimensions?: string;
  annee?: number;
  prix?: number;
  tauxremise?: number;
  taxes?: number;
  image?: Blob;
  description?: string;
  idArtiste?: number;
  dateAjout?: Date;
  idSouscription: number;
  safeImageUrl: SafeUrl;
  Technique?: Technique;
  
  
  constructor(/*id: number,
    nom: string,
    prix: number,
    currency: string,
    description: string,
    artiste: string,
    idCouleur: Couleur,
    image: Blob,
    nouveau: boolean,
    dimensions: string,
    tauxremise: number,
    taxes: number,
    lithographie: boolean,
    idTechnique: Technique,
    fraisLivraison: number,
    idArtiste: number,
    idSouscription: number,*/){}
}