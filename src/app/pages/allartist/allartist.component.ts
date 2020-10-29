import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Oeuvre } from 'src/app/shared/modeles/oeuvre';
import { ArtisteService } from 'src/app/shared/services/artiste.service';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-allartist',
  templateUrl: './allartist.component.html',
  styleUrls: ['./allartist.component.scss']
})
export class AllartistComponent implements OnInit {

  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  artistes: any[] = [];
  oeuvreCouv: Oeuvre;

  constructor(private artisteService: ArtisteService,private oeuvreService: OeuvreService, private toastr: ToastrService) {
    this.artisteService.getArtistes().subscribe(
      response => {
        this.artistes = response;
        console.log("all artiste",this.artistes)
        if(this.artistes && this.artistes.length === 0){
          this.toastr.info('Liste artiste vide', 'INFO');
        }
        // console.log('artistes:' + JSON.stringify(this.artistes));
       },
       err => {
         console.log('erreur : ' + err);
         this.toastr.error('Erreur récupération de la liste des artistes.', 'Erreur');
        }
    )
  }

  ngOnInit(): void {
  }
  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  getArtisteCouvertureImageUrl(id: number) {
    return environment.API_ENDPOINT + 'oeuvre/artiste/CouvertureImg/' + id;
  }
  getProductImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
  }
}

