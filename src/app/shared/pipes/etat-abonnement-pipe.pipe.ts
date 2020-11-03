import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'etatAbonnementPipe'
})
export class EtatAbonnementPipePipe implements PipeTransform {

  transform(value: number): string {
    let libelle: string = "";
    switch (value) {
      case 1:
        libelle = "En attente de validation";
        break;
      case 2:
        libelle = "En attente de paiement";
        break;
      case 3:
        libelle = "En cours de validité";
        break;
      case 4:
        libelle = "Expiré";
        break;
      case 5:
        libelle = "Invalide";
        break;
    
      default:
        break;
    }
    return libelle;
  }


}
