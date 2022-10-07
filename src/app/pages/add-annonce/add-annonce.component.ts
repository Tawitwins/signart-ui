import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Annonce } from '../../shared/modeles/exposition';
import Swal from 'sweetalert2';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { AuthServiceS } from '../../shared/services/auth.service';

declare var $: any;
@Component({
  selector: 'app-add-annonce',
  templateUrl: './add-annonce.component.html',
  styleUrls: ['./add-annonce.component.scss']
})
export class AddAnnonceComponent implements OnInit {
  add: number;
  isValid: boolean;
  annonceForm: any;
  artiste: any;
  public dateValue: Date = new Date ("05/16/2017 3:00 AM");

  constructor(private formbuilder:FormBuilder,private authService:AuthServiceS,private oeuvreService:OeuvreService) { }

  initForm() {
    this.annonceForm = this.formbuilder.group({
       'titre': ['',Validators.required],
       'lieu': ['',Validators.required],
       'dateDebut':[null,Validators.required],
       'dateFin': [null,Validators.required],
       'description': ['',Validators.required],
       'etat': [false]
     });
   }
  ngOnInit(): void {
    this.artiste=this.authService.getArtisteConnected();
    this.initForm();
  }

  addNewAnnonce(bit: number){
    this.add = bit;
  }
  show() {
    //Return if not running. Shouldn't be needed as runShow proceeds show in the template.
    if(this.annonceForm.get('dateFin').touched && (this.annonceForm.value.dateDebut >= this.annonceForm.value.dateFin)) {
      console.log("invalide form",this.isValid)
      this.isValid = false;
      return true;
    }else{
      this.isValid = true;
      return false;

    }
      
  }
  onAddAnnonce(){
    const formvalue = this.annonceForm.value;
    console.log('formvalue ', formvalue)
    const annonce = new Annonce('', '', '', null, null,null,false);
      annonce.titre = formvalue.titre;
      annonce.description = formvalue.description;
      annonce.lieu = formvalue.lieu;
      annonce.dateDebut = formvalue.dateDebut;
      annonce.dateFin = formvalue.dateFin;
      annonce.idArtiste =this.artiste.id
      annonce.etatPublication = formvalue.etat
    console.log('annonce ', annonce);
  
    Swal.fire({
      title: 'Confirmez vous la souscription de cette annonce?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #376809',
      cancelButtonColor: 'red',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this.oeuvreService.addAnnonce(annonce).subscribe(
          resp =>{
            console.log(resp)
            $.notify({
              icon: "notifications",
              message: "Annonce souscrite avec succès!"
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
        //location.reload();
      }
    })
    this.initForm();
    this.add = 0;
   }
}
