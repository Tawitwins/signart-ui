import { Oeuvre } from './oeuvre';
import { LigneCommande } from './ligneCommande';
import {Address} from './address';

export class Livraison {
    id:number;
    dateLivraisonPrevue?: string;
    dateLivraisonEffective?:string;
    idAdresseLivraison: number;
    adresseLivraison?:Address;
    idModeLivraison: number;
    codeEtatLivraison: string;
    libelleModeLivraison: string;
    lignesCommande: LigneCommande[];
}
