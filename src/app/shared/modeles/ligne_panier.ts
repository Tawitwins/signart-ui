import { Oeuvre } from "./oeuvre";
import { Panier } from './panier';

export class LignePanier {
    id: number;
    quantite: number;
    prix: number;
    total: number;
    oeuvre: Oeuvre;
    lithographie: boolean;
  }