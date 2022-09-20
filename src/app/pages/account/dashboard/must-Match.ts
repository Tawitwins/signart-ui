import { FormGroup, ValidationErrors, AbstractControl, FormControl, ControlContainer } from '@angular/forms';
import { User } from 'firebase';
import { AuthServiceS } from 'src/app/shared/services/auth.service';
//import { AuthServiceS } from 'app/shared/services/auth.service';
//import { User, AccountInfo } from 'app/shared/modeles/user';


// custom validator to check that two fields match
export class MustMatchValidators{
    static user: User;
    static authS: AuthServiceS;
    //static authS: AuthServiceS;

   /* constructor(authS:AuthServiceS){
        
        console.log('looooll',MustMatchValidators.user);

    }*/
    
    

    static mustMatch(control: AbstractControl) : Promise<ValidationErrors | null>{
       // const user= this.authS.getUserConnected();
      /* MustMatchValidators.user = MustMatchValidators.authS.getUserConnected();
        const userDetails = new AccountInfo('','');
        userDetails.userName = MustMatchValidators.user.email;
        userDetails.password = control.value.mdpActu;
        const userfind = this.authS.testPassword(userDetails);*/
        return new Promise((resolve, rejects) =>{
            setTimeout(() => {
                if(control.value === 'pendaa'){
                    //console.log(userfind);
                    resolve({ mustMatch: true});
                
                }
                else
                   resolve(null);
            }, 2000);
        });  

    }

    static checkPasswords(group: FormGroup) : ValidationErrors | null { // here we have the 'passwords' group
       let pass = group.get('mdpNouv').value;
       let confirmPass = group.get('mdpConf').value;

       return pass === confirmPass ? null : { checkPasswords: true }     
    }

    getDetails(){

    }

}

