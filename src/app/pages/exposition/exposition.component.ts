import { Component, OnInit } from '@angular/core';
import { Artiste } from 'src/app/shared/modeles/artiste';
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
  public expositions: any [] = [];
  public artiste: Artiste;

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
        console.log("expositions", this.expositions)
      })
  }

  ngOnInit(): void {
  }

  getArtisteImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
}

}
