import { LignePanier } from "./ligne_panier";

export class Panier {
    id?: number;
    nbTotal?: number;
    total?: number;
    totalLivraison?: number;
    totalTaxes?: number;
    lignesPanier?: LignePanier[];
    state?: string;
    codeDevise?: string;
    dateCreation?: Date;
    idClient?: number;
    idDevise?: number;
    idEtatPanier?: number;
    libelleEtatPanier?:string;
    risque?:boolean;
}