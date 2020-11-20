import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { AppState } from '../../../interfaces';
import { getAuthStatus } from '../../../auth/reducers/selectors';
import { Artiste } from '../../../shared/modeles/artiste';
import { ArtisteService } from '../../../shared/services/artiste.service';
import { Client } from '../../../shared/modeles/client';
import { OeuvreService } from '../../../shared/services/oeuvre.service';

//import { CheckoutService } from 'src/app/shared/services/checkout.service';
import Swal from 'sweetalert2';
import { MustMatchValidators } from './must-Match';
import { User, AccountInfo } from '../../../shared/modeles/user';
import { Commande } from '../../../shared/modeles/commande';
import { Abonnement, Abonne, EtatAbonnement, Terminal, HistoriqueAbonnement } from '../../../shared/modeles/utilisateur';
import { ImageService } from '../../../shared/services/image.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user:User;
  token:string;
  @Input() tk:any;
  form:FormGroup;
 //idClient=localStzorage.getItem('id');
 idUser:number;
 commandes:Commande[];
 adresses:any[];
 public artistes:any[];
 oeuvres:any = [];
 oeuvresImg: any;
 client:any;
 artiste:Artiste | any;
 idCustomer:number;
 //--pagination
 pageSize = 4;
 page=1;
 pg=1;
 size:number;
 myGroup:FormGroup;
 public abonnements: Abonnement[];
 public allAbonnement: Abonnement[];
 abonnementget: Abonnement;
 abonne: Abonne;
 etatAbonnements: EtatAbonnement[];
 terminals: Terminal[];
 abonnementExiste: boolean;
 allAbonne: Abonne[];
 historiqueExiste: boolean;
 historiques: HistoriqueAbonnement[];
 returnUrl: string;
 mdpForm:FormGroup;
 etats: EtatAbonnement[];
 
  public openDashboard: boolean = false;
  public infopage: number;
  public listeArtiste: number
  public listAdress:boolean=true;


  constructor(private authService: AuthServiceS,  private store: Store<AppState>, private router: Router,
    private authS:AuthServiceS,
    private oeuvreS:OeuvreService,private fb:FormBuilder,
    private artisteService:ArtisteService,
    private imageService: ImageService,
    public jwtHelper: JwtHelperService,
    private route: ActivatedRoute,) {
    this.infopage = 0;
    this.initmdpForm();
    this.listeArtiste = 0;
    this.abonnementExiste = false;
    this.historiqueExiste = false;
    this.abonnements = [];
    this.historiques = [];
    this.abonnementget = new Abonnement(null,null,null,null,null,'',null)
    this.allAbonne = [];
    this.allAbonnement = [];
    this.user=this.authS.getUserConnected();

    this.imageService.getAllEtat().subscribe(
      response => { 
        this.etats = response;
        console.log("etats",this.etats);
      });

    if(this.user.userType == 'ARTISTE'){
    this.artisteService.getArtisteByUser(parseInt(this.user.id)).subscribe(
      res => {
        this.artiste = res
        console.log('Artiste connected ', res)
        this.oeuvreS.getOeuvreByArtiste(parseInt(res.id)).subscribe(
          resp => {
            this.oeuvres = resp;
            console.log('ouevres de l\'auteur', resp)
          }
        );

      }
    );
    console.log('User connected ', this.user)
  }else{
    this.infoClient();
    this.imageService.getAllEtat().subscribe( res => {
      this.etatAbonnements = res;
    });
    this.imageService.getAllTerminal().subscribe( res => {
      this.terminals = res;
    });

    this.imageService.getAllHistoriqueAbonnement(parseInt(this.user.id)).subscribe(
      res => {
        this.historiques = res;
        if(this.historiques.length > 0){
          console.log("historiques",this.historiques)
          for (let i = 0; i < this.historiques.length; i++) {
            this.historiques[i].dateDebut = this.myDateParser(this.historiques[i].dateDebut);
            this.historiques[i].dateFin = this.myDateParser(this.historiques[i].dateFin);
            
          }
          this.historiqueExiste = true;
        }else{
          this.historiqueExiste = false;
        }
      });

    this.imageService.getAllAbonne(parseInt(this.user.id)).subscribe(
      res => {
        this.allAbonne = res;
        console.log("allAbonne",this.allAbonne)
        if(this.allAbonne.length > 0){
          for (let i = 0; i < this.allAbonne.length; i++) {
            this.imageService.getAbonnement(this.allAbonne[i].id).subscribe(
              resp => {
                this.abonnementget = resp;
                console.log("abonnementget",this.abonnementget)          
                  this.allAbonnement.push(this.abonnementget);
                 // console.log("abonnements",this.abonnements)               
              });         
          }
          this.abonnementExiste = true;
          console.log("abonnements",this.allAbonnement)
          this.allAbonnement.reverse();
          this.abonnements = this.allAbonnement;   
          this.abonnements.reverse();    
        }else{
          this.abonnementExiste = false;
        }  
      });
    
      
    /*this.imageService.getAbonne(parseInt(this.user.id)).subscribe(
      res => {
        this.abonne = res;
        console.log("abonne",this.abonne)
        this.imageService.getAbonnement(this.abonne.id).subscribe(
          resp => {
            this.abonnements = resp;
            if(this.abonnements.length > 0){
              this.abonnementExiste = false;
              console.log("abonnements",this.abonnements)
              this.abonnements=this.abonnements.reverse();
            }else{
              this.abonnementExiste = true;
            }
            
          });
      });*/
      this.client=[];
    this.commandes=[];
    this.artiste=[];
    this.onGetArtisteSuiviByClient();
    }
  }

  initmdpForm(){
    this.mdpForm = new FormGroup({
      mdpActu: new FormControl('',Validators.required),
      mdpNouv: new FormControl('',
        [Validators.required,
       // Validators.pattern('*[a-z]*[A-Z]*'),
        Validators.minLength(8)]
      ),
      mdpConf: new FormControl('',Validators.required)
    },MustMatchValidators.checkPasswords);
  }

  
   showHideListe(val: number){
        this.listeArtiste = val;
  }
  showHideListAdress(bool)
  {
    this.listAdress=bool;
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout() {
    this.authService.signOut();
    this.redirectIfUserLoggedOut();
    //location.reload();
 }
 redirectIfUserLoggedOut(){
  this.store.select(getAuthStatus).subscribe(
    data => {
      if (data === false) {
      //this.router.navigate(['home']);
      this.router.navigate([this.returnUrl]);
     }
    }
  );
 }

 editInfo(){
  this.infopage = 1;
 }

 onChangePwd(){
     
  const passwordForm = this.mdpForm.value;
  console.log('passworForm',passwordForm)
  const userDetails = new AccountInfo('','');
  userDetails.userName = this.user.email;
  userDetails.password = passwordForm.mdpActu;
  this.authS.testPassword(userDetails).subscribe(
    resp =>{
      const testUser = resp
      console.log('test1',testUser);
      if(testUser === null){
        Swal.fire({
          title: 'votre ancien mot de passe est incorrect!',
          icon: 'error',
          cancelButtonColor: '#d33',
        });
      }
      else{
        console.log('test2',testUser);
        this.authS.changeUserPassword(passwordForm.mdpNouv,userDetails).subscribe(
              resp =>{
                console.log(resp)
                Swal.fire({
                  title: 'Votre mot de passe a été modifié avec avec succés!',
                  icon: 'success',
                  cancelButtonColor: '#d33',
                });
                
              }
            );
            //$("#modifPWD").modal("hide");
            //this.onStart();
       // this.isclicked=1;
       this.mdpForm.reset();
       this.infopage = 0;
      // location.reload();
      
            
          }
          
        })
        
      
  
}  

 onSubmit(){ 
  this.client={
   id: this.client.id,
   nom: this.form.get('nom').value,
   prenom: this.form.get('prenom').value,
   sexe: this.client.sexe,
   adresseFacturation:"Dakar",
   adresseLivraison:"Dakar",
   ville:"Dakar",
   telephone: this.form.get('mobile').value,
  // dateNaissance:this.client.date,
   etatClient:this.client.etatClient,
   idEtatClient: this.client.idEtatClient,
   idPays:1,
   pays: this.client.pays,
   idUser: this.client.idUser,
 }
 console.log('client à mettre à jour',this.client)
 this.authS.editClient(this.client).subscribe(
 data => {
 this.client=data;
 console.log('mise à jour',data);
 },
 error => {
   alert(error);
 });
}

initForm(){
  const prenom='';
  const nom='';
  const mobile='';
  const dateNaissance='';

  this.form=this.fb.group(
   {
     'prenom': [prenom, Validators.compose([Validators.required])],
     'nom': [nom, Validators.compose([Validators.required])],
     'mobile': [mobile, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}')])],
     'dateNaissance': [dateNaissance]
     
   });
}
 ngOnInit() {  
   this.infoUser();
   this.initForm();
   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
 }
 infoUser(){
   this.user=this.authS.getUserConnected();
   console.log('MonUser',this.user);
 }
infoClient(){
  this.oeuvreS.getClientByUser(parseInt(this.user.id))
  .subscribe(
    response => { 
      this.client = response;
      console.log('MonClient',this.client);
     },
     (error)=>{
       console.log(error);
     });
}


commandesClient(){
  this.infopage = 3;
 this.idUser=parseInt(this.user.id);
 this.oeuvreS.getClientByUser(this.idUser)
 .subscribe(
   response => { 
     this.client = response;
     this.oeuvreS.getCommandeOfClient(this.client.id).subscribe(
       data=>{
         console.log(data);
         this.commandes= data;
         //this.size=this.commandes.length;
         this.commandes=this.commandes.reverse();
         console.log('les commandes:' ,this.commandes);
       },
       error => {
         console.log(error)
       })
   });
}

favorisClient(){
  this.infopage = 4
}


getAdresse(){
  this.infopage = 2
 this.idUser=parseInt(this.user.id);
 this.oeuvreS.getClientByUser(this.idUser)
 .subscribe(
   response => { 
     this.client = response;
 this.authS.getAdresseOfUserConnected(this.client.id).subscribe(
    (adr:any)=>{
      this.adresses=adr;
      console.log('adresses:',this.adresses);
    },
    error=>{
      console.log(error)
    }
  );});
}
onDeleteAdresseOfUser(id:number){
  this.authS.deleteAdresseOfUser(id).subscribe(
    (data:any)=>{
      console.log(data);
      this.ngOnInit();
    },
    error=>{
      console.log(error);
    }
  );

}
onGetArtisteSuiviByClient(){
 
 this.idUser=parseInt(this.user.id)
 this.oeuvreS.getClientByUser(this.idUser)
 .subscribe(
   response => { 
   this.client = response;
   this.oeuvreS.getArtisteByClient(this.client.id).subscribe(
   (response:any)=>{
     this.artistes=response;
     this.size=this.artistes.length;
     console.log('artistes suivis',this.artistes);
     },
    (error)=>{
     console.log(error)
     });
   });
}

matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
 return (group: FormGroup): { [key: string]: any } => {
   let password = group.controls[passwordKey];
   let confirmPassword = group.controls[confirmPasswordKey];
   if (password.value !== confirmPassword.value) {
     return {
       mismatchedPasswords: true
     };
   }
 }
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
 let validDate = jour+'/'+moi+'/'+annee+ ' à ' + time; 
 //+ '.' + millisecond;
 console.log(validDate)
 return validDate
}

getLibelleEtatAbonnement(idEtat: number){
  for (let i = 0; i < this.etats.length; i++) {
    if(this.etats[i].id == idEtat){
      return this.etats[i].libelle;
    }
    
  }
}
}
