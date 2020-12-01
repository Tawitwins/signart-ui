import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtisteService } from '../../shared/services/artiste.service';
import { Artiste } from '../../shared/modeles/artiste';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { Client } from '../../shared/modeles/client';
import { Visiteur } from '../../shared/modeles/visiteur';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
  actionsSubscription: any;
  artisteId: any;
  artiste: any;
  clients: Client[]=[];
  Visiteurs: Visiteur[]=[];
  pageSize = 6;
  pag=1;
  pg=1;
  //size:number;
  pageSizeListe = 2;

  constructor(private route:ActivatedRoute,private oeuvreServices: OeuvreService,private artisteService: ArtisteService) {
    this.actionsSubscription = this.route.params.subscribe(
      (params: any) => {
          this.artisteId = params['idArtiste'];
          console.log('id artiste: ' + this.artisteId)
          this.artisteService
              .getArtiste(this.artisteId)
              .subscribe(response => {
                  this.artiste = <Artiste>response;
                  this.oeuvreServices.getListClientByArt(parseInt(this.artiste.id))
                  .subscribe(
                    (response)=>{
                      this.clients= <Client[]>response;
                      console.log('les clients de l\'artiste',this.clients)
                     
                    }
                  );
                  this.oeuvreServices.getListVisiteurByArt(this.artiste.id)
                  .subscribe(
                    (response)=>{
                      this.Visiteurs= <Visiteur[]>response; 
                      console.log("Les visiteurs de l'artiste",this.Visiteurs);
                      this.Visiteurs=this.Visiteurs.reverse();
                     })
               });
      }
  );
   }

  ngOnInit(): void {
  }

  getArtisteImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
}
}

