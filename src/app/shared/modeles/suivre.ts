/*export class Suivre {
    public codeTypeMarquage: string;
    public dateMarquage: any;
    public idArtiste: number;
    public idClient: number;
    public idTypeMarquage: number;
    constructor(
        codeTypeMarquage: string,
        dateMarquage: any,
        idArtiste: number,
        idClient: number,
        idTypeMarquage: number) {}
}
*/
export class Suivre {
    id: number;
    codeTypeMarquage: string;
    dateMarquage: any;
    idArtiste: any;
    idClient: any;
    idVisiteur: any;
    idTypeMarquage: any;
    constructor(id: number,codeTypeMarquage: string, dateMarquage: any, idArtiste: number,
    idClient: number, idTypeMarquage: number, idVisiteur: number) {
    this.id=id;
    this.codeTypeMarquage = codeTypeMarquage;
    this.dateMarquage = dateMarquage;
    this.idArtiste = idArtiste;
    this.idClient = idClient;
    this.idTypeMarquage = idTypeMarquage;
    this.idVisiteur= idVisiteur;
    }
}
