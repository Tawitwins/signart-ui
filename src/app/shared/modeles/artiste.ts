export class Artiste {
    id?: number;
    prenom: string;
    nom: string;
    surnom: string;
    telephone: string;
    email: string;
    adresse: string;
    ville: string;
    pays: string;
    biographie: string;
    profession: string;
    constructor(
        prenom: string,
    nom: string,
    surnom: string,
    telephone: string,
    email: string,
    adresse: string,
    ville: string,
    pays: string,
    biographie: string,
    profession: string
        ){
           
           
        }


    
}


export class Formation {
    id?: number;
    sigle: string;
    libelle: string;
    lieu: string;
    idArtiste: number;
    etatPublication: Boolean;
    specialisation: string;
    anneeDebut: any;
    anneeFin: any;

    constructor(
        sigle: string,
        libelle: string,
        lieu: string,
        idArtiste: number,
        etatPubFormation: Boolean,
        specification: string,
        dateDebut: any,
        dateFin: any){}
}


export class Presentation {
    id?: number;
    libelle: string;
    videoId: string;
    etatPubPresentation: Boolean;
    idArtiste: number;

    constructor(
    libelle: string,
    videoId: string,
    etatPubPresentation: Boolean,
    idArtiste: number){}
}

export class ImageProfil{
    filename: string;
    filetype: string;
    value: string;
    constructor(
        filename: string,
        filetype: string,
        value: string
    ){}
}
