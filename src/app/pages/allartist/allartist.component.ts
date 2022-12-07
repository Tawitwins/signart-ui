import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Artiste } from '../../shared/modeles/artiste';
import { Oeuvre } from '../../shared/modeles/oeuvre';
import { environment } from '../../../environments/environment';
import { Suivre } from '../../shared/modeles/suivre';
import { User } from '../../shared/modeles/user';
import { AuthServiceS } from '../../shared/services/auth.service';
import { ArtisteService } from '../../shared/services/artiste.service';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { Client } from '../../shared/modeles/client';
import { Visiteur } from '../../shared/modeles/visiteur';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { VisiteurService } from '../../shared/services/visiteur.service';
import { Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


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
  suivreart: string;
  isVisiteur: boolean;
  visiteur: Visiteur =new Visiteur(0,"","","","","",0);
  suivre: any;
  couleur: string;
  marq: any[]=[];
  client: Client= new Client("",0,0,new Date(),"","",0,"","","","","",0,"");
  listes1: any;
  user: User;
  currentArtiste: any;
  FormVisiteur: FormGroup;
  allPays: any;
  selectedPays: any;

  initForm() {
    const Prenom = '';
    const Nom = '';
    const RaisonSociale = '';
    const TypeVisiteur = '';
    const Pays = '';

    this.FormVisiteur = this.fb.group({
      'Prenom': [Prenom, Validators.compose([Validators.required])],
      'Nom': [Nom, Validators.compose([Validators.required])],
      'RaisonSociale': [RaisonSociale, Validators.compose([Validators.required])],
      'TypeVisiteur': [TypeVisiteur, Validators.compose([Validators.required])],
      'Pays': [Pays, Validators.compose([Validators.required])],

    }, 
    );
  }

  constructor(
    private artisteService: ArtisteService,
    private router:Router,
    private visiteurService:VisiteurService, 
    private fb:FormBuilder, 
    private authS:AuthServiceS,
    private suivreService:OeuvreService,
    private oeuvreService: OeuvreService, 
    private toastr: ToastrService,
    private translate: TranslateService
    ) {
    this.initForm();
    this.user = this.authS.getUserConnected();
    if(this.user!=null)
    {
      this.suivreService.getClientByUser(+this.user.id)
                .subscribe(
                    response => {
                        this.client = response;
                    });
    }
    else{
      this.client=null;
    }
    this.artisteService.getArtistes().subscribe(
      response => {
        this.artistes = response;
        this.artistesSave = this.artistes;
        //console.log("all artiste",this.artistes)
        if(this.artistes && this.artistes.length === 0){
          this.translate.get('PopupListArtisteVide').subscribe(popup => {
            this.toastr.info(popup, 'INFO');
            })
          // this.toastr.info('Liste artiste vide', 'INFO');
        }
        for (let i = 0; i < this.artistes.length; i++) {
          this.marq.push(false);
          this.professions.push(this.artistes[i].profession);    
          if(this.user!=null)
          {
              this.suivreService.getMarquageByArtiste(+this.client.id, +this.artistes[i].id, 'SUIV')
              .subscribe(response => { this.marq[i] = response;
              if (response==null)
              {
                this.marq[i]=false;
              }
              else
              {
                this.marq[i]=true
              }
              });
          }     
        }


        // //console.log('artistes:' + JSON.stringify(this.artistes));
       },
       err => {
         //console.log('erreur : ' + err);
         this.translate.get('PopupErrRecupListArtite').subscribe(popup => {
          this.toastr.error(popup, 'Erreur');
          })
        //  this.toastr.error('Erreur récupération de la liste des artistes.', 'Erreur');
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
      //console.log("profession ",event.target.value);  
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
      //console.log("profession "+i+" :",allProfessions)
      professions.push(allProfessions)
    }
    const finalprofession = [...new Set(professions.map(profess => profess))]
    return finalprofession;
  }*/

  /*get filterbyCategory() {
    const category = [...new Set(this.oeuvres.map(oeuvre => oeuvre.idTechnique))]
    return category
  }*/

  followArtiste(artiste,index){
    this.currentArtiste=artiste;
    if(this.client!=null)
    {
        if (this.marq[index] == false) {
            //console.log('mmmmkl' + this.client.id);
            this.suivre = new Suivre(null,'SUIV', new Date(), +this.currentArtiste.id, this.client.id, 2,this.visiteur.id);
            this.suivreService.suivreArtiste(this.suivre).subscribe(res => {
              this.listes1 = res
              this.marq[index]=true;
              this.artistes[index].nbFans+=1;
            });
        } else {
            this.oeuvreService.plusSuivreArtiste(this.client.id, this.currentArtiste.id, 'SUIV').subscribe(resp=>{
              this.marq[index]=false;
              this.artistes[index].nbFans-=1;
            });
        }
    }
    else if(this.user==null)
    {
      this.router.navigate(['/pages/login']);
        /*//console.log('Aucune connexion est active');
        if(this.marq[index]==false)
            this.isVisiteur=true;
        else
        {
            this.isVisiteur=false;
            //console.log("Mon artiste: "+ this.currentArtiste.id + "Mon visiteur: " + this.visiteur.id); 
            var result = this.oeuvreService.plusSuivreArtisteByVisiteur(this.suivre.id);
            if(result==null)
                //console.log("Aucun élément a été trouvé pour la suppresion");
            else
            {
                result.subscribe(
                    (val) => {
                   //console.log("DELETE request en cours ....", <String>val 
                               );
                               var valSuivre = <Suivre>val;
                               if(valSuivre.id==this.suivre.id)
                               {
                                    this.suivreart = 'Suivre';
                                    this.couleur = '#f07c10';
                                    //console.log('Succès. Vous ne suivez plus cet artiste '+this.currentArtiste.id);
                               }
                               else
                               {
                                    //console.log("Cas particulers !! Val = "+ <Suivre>val );
                               }
               },
               response => {
                   //console.log("DELETE call in error", response);
               },
               () => {
                   //console.log("The DELETE observable is now completed.");
               });
            }
            //this.oeuvreService.plusSuivreArtisteByVisiteur(this.suivre.id)
        }*/
    }  
  }
  onSubmit(){
          
    //onsole.log(Visiteur.prenom+Visiteur.nom+Visiteur.pays+Visiteur.typeVisiteur+Visiteur.raisonSociale);
    //console.log("Visiteur en cour d'enregistrement...");
    const values = this.FormVisiteur.value;
    //console.log('values: ', values)
    const keys = Object.keys(values);
    //console.log(values);
    this.visiteur.pays =this.allPays.find(p=>p.libelle=this.selectedPays);
    this.visiteur.idPays= this.visiteur.pays.id;
    //console.log(this.visiteur);
    if (this.FormVisiteur.valid) {
        //console.log("Visiteur a été enregistrer avec succès");
        //console.log(this.visiteur);
        /*this.visiteur.prenom = values.prenom;
        this.visiteur.nom = values.nom;
        this.visiteur.pays = values.pays;
        this.visiteur.raisonsociale = values.raisonSociale;
        this.visiteur.typeVisiteur = values.typeVisiteur;*/
        //this.visiteur.idPays = this.visiteur.pays.id;
        //console.log(this.visiteur.pays);
        var result =this.visiteurService.createVisiteur(this.visiteur);
        result.subscribe(  
            (val) => {
                //console.log("POST call (save visiteur) successful value returned in body", val); 
                this.visiteur=<Visiteur>val; 
                //console.log("Mise a jour ici", this.visiteur); 
                this.translate.get('AlertIdReussiSA').subscribe(popup => {
                  alert(popup);
                  })
                // alert("Identification réussi et suivi approuvé.");
                this.suivre = new Suivre(null,'SUIV', new Date(), this.currentArtiste.id, 0, 2,this.visiteur.id);
                //console.log("Mon marquest est là "+ this.suivre);
                this.suivreService.suivreArtiste(this.suivre).subscribe( (val) => {
                    //console.log("POST call successful (set marque) value returned in body", 
                                val);
                                //console.log("Reponse souscription", this.listes1);
                                this.suivreart = 'Ne plus suivre';
                                this.couleur = 'grey';
                                document.getElementById('Visiteur').click();
                                this.suivre= <Suivre>val;
                    },
                    response => {
                        //console.log("POST call (set marque) in error", response);
                    },
                    () => {
                        //console.log("The POST observable (set marque) is now completed.");
                    });
              
               // //console.log('affiche ' + this.suivre+this.isVisiteur);
            },
            response => {
                //console.log("POST call (save visiteur) in error", response);
                //console.log("Un problème lors de l'enregistrement des vos informations !!" + result );
            },
            () => {
                //console.log("The POST (save visiteur) observable is now completed.");
        });
        /*this.registerSubs = this.authService.register(values).subscribe(
          data => {     //console.log('datas: ', data)
  
            this.authService.login(values.email, values.password).subscribe(
              resp => //console.log('resp: ', data)
            );
          }
          );*/
      } else {
        //console.log("Un problème a été rencontré avec le formulaire du visiteur ");
        keys.forEach(val => {
          const ctrl = this.FormVisiteur.controls[val];
          if (!ctrl.valid) {
            this.pushErrorFor(val, null);
            ctrl.markAsTouched();
          };
        });
      }
    }
  private pushErrorFor(ctrl_name: string, msg: string) {
      this.FormVisiteur.controls[ctrl_name].setErrors({ 'msg': msg });
  }
  ClickCreateAccount(){
      this.isVisiteur=false;
  }
  resetFilterCategorie() {
    this.artistes = this.artistesSave;
  }
}

