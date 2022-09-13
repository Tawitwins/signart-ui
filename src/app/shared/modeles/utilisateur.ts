

export class Utilisateur {
    id: number; 
    mail: string;
    password: string;
    idProfil: number;
    constructor(
        email: string,
        password: string,
        idProfil?: number
        ){}
}

export class ListSelection{
    id?: number;
    idUtilisateur:number;
    nomListe: string;
    constructor(
        idUtilisateur: number,
        nomListe: string,
        ){}

}

export class ListeSelection_Oeuvres{
    id?: number;
    idListe: number;
    nomOeuvre: string;
    constructor(
        idListe: number,
        nomOeuvre: string,
        ){}

}

export class Abonne{
    id?: number;
    idUtilisateur: number;
    idListeSelection: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    pays: string;
    region: string;
    ville: string;
    adresse: string;
    constructor(
        idUtilisateur: number,
        idListeSelection: number,
        nom: string,
        prenom: string,
        email: string,
        telephone: string,
        pays: string,
        region: string,
        ville: string,
        adresse: string
        ){}

}


export class Terminal{
    id?: number;
    libelle: string;
    description: string;
    prix: number;
    constructor(
        libelle: string,
        description: string,
        prix: number,
        ){}

}

export class EtatAbonnement{
    id?: number;
    libelle: string;
    code: string
    description: string;
    constructor(
        libelle: string,
        code: string,
        description: string,
        ){}

}


export class DelaieAbonnement{
    id?: number;
    libelle: string;
    description: string;
    nbMois: number;
    prix: number;
    constructor(
        libelle: string,
        description: string,
        nbMois: number,
        prix: number
        ){}

}

export class TerminalDelai{
    id?: number;
    terminalLibelle: string;
    delaiLibelle: string;
    terminalId: number;
    delaiId: number;
    precisions: string;
    constructor(
        terminalLibelle: string,
        delaiLibelle: string,
        terminalId: number,
        delaiId: number,
        precisions: string,
    ){}
}

export class Abonnement{
    id?: number;
    idAbonne: number;
    idTerminal: number;
    idDelai: number;
    idListeSelection: number;
    montantPaiement: number;
    precisions: string;
    etatAbonnement: number;
    token:string;
    constructor(
        idAbonne: number,
        idTerminal: number,
        idDelaieAbonnement: number,
        idListeSelection: number,
        MontantPaiement: number,
        precisionss: string,
        etatAbonnement: number
        ){}

}

export class Email {
    to ?: String;
    //from ?: String;
    objet ?: String;
    content ?: String;
    pj?: Blob;
    dateEnvoi?: Date;
    nbrEmail?:number;
    constructor(
    to: String,
    //from: String,
    objet : String,
    content : String,
    pj: Blob,
    ){}
}

export class CodeSignart {
    id ?: number;
    code: string;
    idLicence: number;
    idAbonne: number;
    constructor(
        id: number,
        code: string,
        idLicence: number,
        idAbonne: number,
    ){}
}

export class HistoriqueAbonnement{
    id?: number;
    dateDebut: any;
    dateFin: any;
    liebelle: number;
    idAbonnement: number;
    idUtilisateur: number;
    constructor(
        dateDebut: any,
        dateFin: any,
        liebelle: number,
        idAbonnement: number,
        idUtilisateur: number,
        ){}

}

