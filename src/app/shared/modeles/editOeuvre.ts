import { ImageProfil } from './artiste';

export class editOeuvre{
    constructor(
        //public id: number,
        public nom: string,
        public technique: string,
        public couleur: string,
        public nouveau: boolean,
        public lithographie: boolean,
        public auteur: string,
        public dimensions: string,
        public annee: number,
        public prix: number,
        public tauxremise: number,
        public taxes: number,
        public image: Blob,
        public description: string,
        //public currency: string,
        ){
    }
}

export class addOeuvre{
    //public id: number;
        public nom: string;
        public idTechnique: number;
        public idCouleur: number;
        public nouveau: boolean;
        public lithographie: boolean;
        public auteur: string;
        public dimensions: string;
        public annee: number;
        public prix: number;
        public taxes: number;
        public tauxremise: number;
        public image: ImageProfil;
        public description: string;
        public idArtiste: number;
        //public fraisLivraison: number;
        //public dateAjout: Date;
        //public miniature: string;
        //public couleur: string;
       // public idSousTechnique;
        //public sousTechnique: string;
        // public technique: any;
        //public artiste: string;
    constructor(
        //id: number,
        nom: string,
        idTechnique: number,
        idCouleur: number,
        nouveau: boolean,
        lithographie: boolean,
        auteur: string,
        dimensions: string,
        annee: number,
        prix: number,
        taxes: number,
        tauxremise: number,
        image: Blob,
        description: string,
        idArtiste: number,
        //fraisLivraison: number,
        //dateAjout: Date,
        //miniature: string,      
        //couleur: string,
        //idSousTechnique,
        //sousTechnique: string,
        //technique: any,
        //artiste: string
        //public currency: string,
        ){}
}


