export class Client {
    etatClient ?: string;
    id?:number;
    idEtatClient?: number;
    dateNaissance?: Date;
    nom ?: string;
    pays ?: string;
    prenom ?: string;
    idPays?:number;
    sexe ?: string;
    adresseFacturation?:string;
    adresseLivraison?:string;
    ville?:string;
    idUser ?: number;
    telephone ?: string;
    constructor(
    etatClient: string,
    id:number,
    idEtatClient: number,
    dateNaissance: Date,
    nom: string,
    pays: string,
    idPays:number,
    prenom: string,
    sexe: string,
    adresseFacturation:string,
    adresseLivraison:string,
    ville:string,
    idUser: number,
    telephone: string,
    ){}
}