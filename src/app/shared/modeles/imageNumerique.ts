export class ImageTest {
    id: number;
    avatar: string|any;
}

export class OeuvreNumerique {
    id: number;
    annee: number;
    titre: string;
    technique: string;
    largeur: number;
    longueur: number;
    motscles: string;
    tarif: number;
   // categorie: string;
    description: string;
    avatar: Image;
    nom: string;
    identiteAuteur: number;
    isDisabledAdd: boolean;
    isDisabledRemove: boolean;


    

    constructor(
        annee: number,
        technique: string,
        titre: string,
        largeur: number,
        longueur: number,
        motscles: string,
        tarif: number,
       // categorie: string,
        description: string,
        avatar: Image,
        identiteAuteur: number,
        nom: string,
        isDisabledAdd: boolean,
        isDisabledRemove: boolean
        ){}
}

export class Image {
    filename: string;
    filetype: string;
    value: string;
    

    constructor(
        filename: string,
        filetype: string,
        value: string
        ){}
}

export class Auteur {
    id?: number;
    nom: string;
    prenom: string;
    surnom: string;
    specialite: string;
    biographie: string;
    photoAuteur: Image;
    identite: string;

    constructor(
         nom: string,
         prenom: string,
         surnom: string,
         specialite: string,
         biographie: string,
         photoAuteur: Image,
         identite: string
        ){}
}