import { Oeuvre } from './oeuvre';
import { LigneCommande } from './ligneCommande';
import {Address} from './address';

export class Livraison {
    id:number;
    dateLivraisonPrevue?: string;
    dateLivraisonEffective?:string;
    dateLivraison:Date;
    idAdresseLivraison: number;
    adresseLivraison?:Address;
    idModeLivraison: number;
    codeEtatLivraison: string;
    libelleEtatLivraison: string;
    libelleModeLivraison: string;
    lignesCommande: LigneCommande[];
}
