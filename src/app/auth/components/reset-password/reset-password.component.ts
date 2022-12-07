import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthServiceS } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordFormInit: FormGroup;
  //email: string;
  email : FormControl;
  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthServiceS
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    //this.resetPasswordFormInit = this.formBuilder.group({
      //'mail': ['', Validators.email]
      //newpassword: ''
    //});
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Vous devez entrer une valeur' :
        this.email.hasError('email') ? 'Mail pas valide': '';
  }
  onSubmit(){
    //let mail = this.resetPasswordFormInit.value;
    //console.log('mail ', this.email.value);
    this.authservice.forgotPassword(this.email.value);
    this.initForm();
  }
}
