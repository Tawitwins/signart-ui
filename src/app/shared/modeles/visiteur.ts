import { Pays } from './pays';

export class Visiteur {
    id?:number;
    nom ?: string;
    pays ?: Pays;
    raisonSociale ?: string;
    prenom ?: string;
    typeVisiteur?: string;
    idPays?:number;
    constructor(
    id:number,
    nom: string,
    pays: string,
    raisonsociale : string,
    prenom: string,
    typeVisiteur: string,
    idPays:number,
    ){}
}