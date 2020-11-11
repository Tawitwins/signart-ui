import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Artiste } from 'src/app/shared/modeles/artiste';
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
  public professions: string[] = [];
  //public professionsFiltre: string[] = ["Peintre","Sculpteur","Photographe","Artiste Plasticien","lisseur","Cartonnier"];

  public artistes: Artiste[] = [];
  public artistesSave: Artiste[] = [];
  oeuvreCouv: Oeuvre;
  pageSize = 6;
  pag=1;
  pg=1;
  //size:number;
  pageSizeListe = 2;


  constructor(private artisteService: ArtisteService,private oeuvreService: OeuvreService, private toastr: ToastrService) {
    this.artisteService.getArtistes().subscribe(
      response => {
        this.artistes = response;
        this.artistesSave = this.artistes;
        console.log("all artiste",this.artistes)
        if(this.artistes && this.artistes.length === 0){
          this.toastr.info('Liste artiste vide', 'INFO');
        }
        for (let i = 0; i < this.artistes.length; i++) {
          this.professions.push(this.artistes[i].profession);         
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

  updateFilterArtiste(event) {
    this.artistes = this.artistesSave;
    if(event.target.value !== "Tout"){
      this.artistes = this.artistes.filter(item => item.profession == event.target.value) 
      console.log("profession ",event.target.value);  
    }
    
  }

 /* sorting(event) {
    this.sortedBy.emit(event.target.value)
  }*/


  /*get filterbyProfession() {
    let allProfessions;
    let professions: string[] = [];
    const profession = [...new Set(this.artistes.map(artiste => artiste.profession))]
    for (let i = 0; i < profession.length; i++) {
      allProfessions = profession[i].split(",");
      console.log("profession "+i+" :",allProfessions)
      professions.push(allProfessions)
    }
    const finalprofession = [...new Set(professions.map(profess => profess))]
    return finalprofession;
  }*/

  /*get filterbyCategory() {
    const category = [...new Set(this.oeuvres.map(oeuvre => oeuvre.idTechnique))]
    return category
  }*/

  resetFilterCategorie() {
    this.artistes = this.artistesSave;
  }
}

