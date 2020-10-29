export class Exposition {
   // id: string;
    adresse: string;
    description: string;
    titre: string;
    dateDebut: any;
    dateFin: any;
    type: string;
    etatExposition: boolean;
    idArtiste: number;

    constructor(
        titre: string,
        description: string,
        adresse: string,
        dateDebut: any,
        dateFin: Date,
        type: string,
        idArtiste: number,
        etatPublication: boolean
        ){}
}

export class Biographie {
    // id: string;
     libelle: string;
     dateNaissance: any;
     lieuNaissance: string;
     nationalite: any;
     etatBiographie: boolean;
     idArtiste: number;
 
     constructor(
        libelle: string,
        dateNaissance: any,
        lieuNaissance: string,
        nationalite: string,
        etatBiographie: boolean,
         idArtiste: number
         ){}
 }

export class Annonce {
    titre: string;
    description: string;
    lieu: string;
    dateDebut: Date;
    dateFin: Date;
    idArtiste: number;
    etatPublication: boolean;
    constructor(
        titre: string,
        description: string,
        lieu: string,
        dateDebut: Date,
        dateFin: Date,
        idArtiste: number,
        etatPublication: boolean
        ){
           
           
        }
}
/*
export class Client {
    adresseFacturation: string;
    adresseLivraison: string;
    dateNaissance: any;
    etatClient: string;
    nom: string;
    pays: string;
    prenom: string;
    sexe: string;
    ville: string;
}
*/

/*export class Formation {
    id?: number;
    sigle: string;
    libelle: string;
    lieu: string;
    specification: string;
    dateDebut: any;
    dateFin: any;
}*/