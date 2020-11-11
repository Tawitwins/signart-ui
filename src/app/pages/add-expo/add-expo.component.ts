import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Exposition } from '../../shared/modeles/exposition';
import Swal from 'sweetalert2';
import { ArtisteService } from '../../shared/services/artiste.service';
import { AuthServiceS } from '../../shared/services/auth.service';

declare var $: any;
@Component({
  selector: 'app-add-expo',
  templateUrl: './add-expo.component.html',
  styleUrls: ['./add-expo.component.scss']
})
export class AddExpoComponent implements OnInit {
  form: FormGroup;
  isValid: boolean;
  isclicked: number;
  artiste: any;

  constructor(private formbuilder:FormBuilder,private authService:AuthServiceS,private artisteService:ArtisteService) { }

  initForm() {
    this.form = this.formbuilder.group({
       'titre': ['',Validators.required],
       'type': ['',Validators.required],
       'description': ['',Validators.required],
       'adresse': ['',Validators.required],
       //'latitude': ['',Validators.required],
       //'longitude': ['',Validators.required],
       'dateDebut':[null,Validators.required],
       'dateFin': [null,Validators.required],
       'etat': [false]
     });
   }
  ngOnInit(): void {
    this.artiste=this.authService.getArtisteConnected();
    this.initForm();
  }

  show() {
    //Return if not running. Shouldn't be needed as runShow proceeds show in the template.
    if(this.form.get('dateFin').touched && (this.form.value.dateDebut >= this.form.value.dateFin)) {
      console.log("invalide form",this.isValid)
      this.isValid = false;
      return true;
    }else{
      this.isValid = true;
      return false;

    }
      
  }
  addNewExposition(bit: number){
    this.isclicked = bit;
  }
  onAddExposition(){
    const formvalue = this.form.value;
    console.log('formvalue ', formvalue)
    const exposition = new Exposition('', '', '', '',null, null,null,false,null);
    exposition.titre = formvalue.titre;
    exposition.description = formvalue.description;
    exposition.type = formvalue.type;
    exposition.adresse = formvalue.adresse;
    exposition.dateDebut = formvalue.dateDebut;
    exposition.dateFin = formvalue.dateFin;
    exposition.idArtiste =this.artiste.id
    exposition.etatExposition = formvalue.etat
    console.log('exposition ', exposition);
  
    Swal.fire({
      title: 'Confirmez vous la souscription de cette Exposition?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, je confirme!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        this.artisteService.onAddExposition(exposition).subscribe(
          resp =>{
            console.log(resp)
            $.notify({
              icon: "notifications",
              message: "Expositon souscrite avec succés!"
            }, {
                type: 'success',
                timer: 1000,
                placement: {
                  from: 'top',
                  align: 'center'
                }
              });
          
          }
         
  
        );
      //location.replace("./accueil");
      }
    })
    this.initForm();
    this.isclicked = 0;
   }
}
