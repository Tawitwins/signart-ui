import { Oeuvre } from './oeuvre';

export class LigneCommande {
    id: number;
    oeuvre:Oeuvre;
    prix:number;
    quantite:number;
}