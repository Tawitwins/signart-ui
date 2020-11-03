import { Pipe, PipeTransform } from '@angular/core';
import { Pays } from 'app/shared/modeles/pays';
import { ImageService } from 'app/shared/services/image.service';

@Pipe({
  name: 'paysPipe'
})
export class PaysPipePipe implements PipeTransform {

  public pays: Pays[];

  constructor(private imageService: ImageService){
    this.pays = [];
    this.imageService.getAllPays().subscribe(response => {
      this.pays = response;
    });
   }
  transform(value: number): string {
   // console.log("artisteeeeee pipe",this.artistes)
   // let artiste: Artiste;
    let nomPays: string = "";
    for (let i = 0; i < this.pays.length; i++) {
      if(value == this.pays[i].id){
        nomPays = this.pays[i].libelle;
      }
      
    }
   // this.nomArtiste = this.str.prenom+""+this.str.nom;
    return nomPays;

  }

}
