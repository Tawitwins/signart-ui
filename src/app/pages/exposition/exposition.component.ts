import { Component, OnInit } from '@angular/core';
import { Artiste } from 'src/app/shared/modeles/artiste';
import { Exposition } from 'src/app/shared/modeles/exposition';
import { ArtisteService } from 'src/app/shared/services/artiste.service';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-exposition',
  templateUrl: './exposition.component.html',
  styleUrls: ['./exposition.component.scss']
})
export class ExpositionComponent implements OnInit {

  public artistes: any [] = [];
  public expositions: Exposition [] = [];
  public artiste: Artiste;
  public artisteName: string;

  pageSize = 2;
  pag=1;
  pg=1;
  size:number;
  pageSizeListe = 2;

  constructor(
    private artisteService: ArtisteService,
    private expoService: OeuvreService
  ) { 
    this.artisteService.getArtistes().subscribe(
      response => {
        this.artistes = response;
        //console.log("all artiste",this.artistes)
        this.artiste = this.artistes[0];
      })

      this.expoService.getAllExpo().subscribe(response => {
        this.expositions = response;
        this.expositions = this.expositions.filter(item => item.etatExposition === true);
        console.log("expositions", this.expositions)
      })
     
  }

  ngOnInit(): void {
  }

  getArtisteName(idArtiste: number): string{
    for (let i = 0; i < this.artistes.length; i++) {
      if(this.artistes[i].id == idArtiste){
        return this.artistes[i].prenom +" "+this.artistes[i].nom;
      }
      
    }
  }

  getArtisteImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
}

myDateParser(dateStr : string) : string {
  // 2018-01-01T12:12:12.123456; - converting valid date format like this

  let date = dateStr.substring(0, 10);
  let annee = dateStr.substring(0, 4);
  let moi = dateStr.substring(5, 7);
  let jour = dateStr.substring(8, 10);
  let time = dateStr.substring(11, 16);
 // let millisecond = dateStr.substring(20)

 // let validDate = date + ' à ' + time; 
  let validDate = jour+'/'+moi+'/'+annee+ ' A ' + time; 
  //+ '.' + millisecond;
  return validDate
}

}
