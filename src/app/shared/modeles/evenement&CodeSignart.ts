export class EvenementSignart {
    id: number;
    titre: string;
    description: string;
    dateCreation: Date;
    dateOfficielle: Date;
    idArtiste: number;
    status:boolean;
    lienVideo:string;
    codeEvenement: string;
    prixCodeEvent: number;
    nbrCodeAchete: number;
    lieu: string;
    contact: string;
    responsable: string;
    idAdminUser: number;
    stringDateCreation: string;
    stringDateOfficielle: string;

    constructor(){

    }
}
export class CodeEventSignart {
    id: number;
    dateCreation: Date;
    dateOfficielle: Date;
    idEvenement: number;
    codeEvenementSignart: string;
    prixCodeEvent: number;
    proprietaire: string;
    status: string;
    code: number;

    constructor(){

    }
}

