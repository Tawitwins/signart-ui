import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Artiste } from '../../shared/modeles/artiste';
import { ArtisteService } from '../../shared/services/artiste.service';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { environment } from '../../../environments/environment';
import { Exposition } from '../../shared/modeles/exposition';
import { DatePipe } from '@angular/common';
import { LocationOnMap } from '../../shared/modeles/locationOnMap';
declare const google: any;

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

  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  locations:LocationOnMap[]=[];
  //expositions: Exposition[]=[];
  ExpositionsValide: Exposition[]=[];
  newLocationMapTmp: LocationOnMap;
  lartiste:Artiste=new Artiste('','','','','','','','','','');
  pipe:DatePipe=new DatePipe('en-US');
  Expos: Exposition| any =[];

  constructor(
    private artisteService: ArtisteService,
    private expoService: OeuvreService,
  ) { 
    this.artisteService.getArtistes().subscribe(
      response => {
        this.artistes = response;
        //console.log("all artiste",this.artistes)
        this.artiste = this.artistes[0];
      });

      this.expoService.getAllExpo().subscribe(response => {
        this.expositions = response;
        this.expositions = this.expositions.filter(item => item.etatExposition === true);
        console.log("expositions", this.expositions)
      })
     
        //console.log("Mes expositions"+resp);
        //console.log("Liste de toutes les expositions"+this.Expositions);
        this.ExpositionsValide = this.expositions.filter(a => a.etatExposition===true && a.idArtiste===this.artiste.id);
        let i=0;
        this.ExpositionsValide.forEach(element => { 
          this.artisteService.getArtiste(element.idArtiste).subscribe(resp =>{
            //console.log(resp);
            i++;
            element.artiste=<Artiste>resp;
            console.log(element.artiste);
            if(i==this.ExpositionsValide.length)
              this.loadMap();
          });
          //console.log(element.dateDebut);
          let date=element.dateDebut.toString();
          date=date.substring(0,19);
          element.dateDebut = new Date(date);
          date=element.dateFin.toString();
          date=date.substring(0,19);
          element.dateFin = new Date(date);
          //console.log(element.dateDebut);
          console.log(element.adresse);
          this.newLocationMapTmp = {adresse:element.adresse,latitude:null, longitude:null,idExpo:element.id}
          this.locations.push(this.newLocationMapTmp);
        });
        console.log(this.locations);
        console.log(this.ExpositionsValide);
        
        console.log("expositions", this.expositions)
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
//-------------Load-----Map------------------ 
  loadMap = () => {
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: {lat: 14.666904, lng:-17.436948},
      zoom: 8
    });
    var geocoder = new google.maps.Geocoder();
    this.locations.forEach(element=>{
      console.log("iciiii:");
      console.log(this.ExpositionsValide.find(currentExpo=>currentExpo.id===element.idExpo));
      this.Expos=this.ExpositionsValide.find(currentExpo=>currentExpo.id===element.idExpo);
      console.log(this.Expos.artiste);
      map=this.geocodeAddress(geocoder,map,element,this.Expos,this.pipe);
    })
  }
  geocodeAddress(geocoder, resultsMap,element,lexposition:Exposition,monpipe) {
    var address = element.adresse;
    console.log(element);
    //console.log(lexposition);
    //console.log(lexposition.artiste);
    let artiste = new Artiste('','','','','','','','','','');
    artiste=lexposition.artiste;
    var img=this.getProductImageUrl(artiste.id);
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
       /*  console.log(this.locations[6][1]);
        console.log(this.locations[6][2]); */
        //console.log(results[0].geometry.location.lat());
        resultsMap.setCenter(results[0].geometry.location);
        element.longitude=  parseFloat(results[0].geometry.location.lng());
        element.latitude= parseFloat(results[0].geometry.location.lat()) ; 
        //console.log(element);
        //console.log('la latitude',results[0].geometry.location.lat);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          title: lexposition.titre,
          draggable: true,
          content: '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h3 id="firstHeading" >'+lexposition.titre+'</h3>'+
          '<div id="bodyContent">'+
          '<p><b>Description: </b>'+lexposition.description+'</p>'+
          '<p><b>Lieu: </b> '+lexposition.adresse+'</p>'+
          '<p><b>Du: </b> '+monpipe.transform(lexposition.dateDebut, 'dd/MM/yyyy') +'<b>   Au: </b>'+monpipe.transform(lexposition.dateFin, 'dd/MM/yyyy')+'</p>'+
          '<p><b>Type: </b> '+lexposition.type+'</p>'+
          '<p><b>Artiste: </b> '+lexposition.artiste.prenom+' '+lexposition.artiste.nom+'</p>'+
          '<img src='+img+' width="80" height="80">'+
          '</div>'+
          '</div>'/* +":"+this.locations[i].longitude+this.locations[i].latitude */,
          animation: window['google'].maps.Animation.DROP,
        });
          // popup au click
        var infowindow = new window['google'].maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(this.content);
          infowindow.open(resultsMap, this);
        });
        //console.log(results[0].geometry.location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
      return resultsMap;
    });
    return resultsMap;
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


  getProductImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
  }
}
