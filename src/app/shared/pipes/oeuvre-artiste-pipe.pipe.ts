import { Pipe, PipeTransform } from '@angular/core';
import { Artiste } from '../modeles/artiste';
import { ArtisteService } from '../services/artiste.service';
//import { ArtisteService } from '../shared/services/artiste.service';
//import { Artiste } from '../shared/modeles/artiste';

@Pipe({
  name: 'oeuvreArtistePipe'
})
export class OeuvreArtistePipePipe implements PipeTransform {

  
  public artistes: Artiste[];

  constructor(private artisteService: ArtisteService){
    this.artistes = [];
    this.artisteService.getArtistes().subscribe(response => {
      this.artistes = response;
    });
   }
  transform(value: number): string {
    console.log("artisteeeeee pipe",this.artistes)
    let artiste: Artiste;
    let nomArtiste: string = "";
    for (let i = 0; i < this.artistes.length; i++) {
      if(value == this.artistes[i].id){
        nomArtiste = this.artistes[i].prenom+" "+this.artistes[i].nom
      }
      
    }
   // this.nomArtiste = this.str.prenom+""+this.str.nom;
    return nomArtiste;

  }
}
