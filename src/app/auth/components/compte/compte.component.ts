import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { getAuthStatus } from '../../reducers/selectors';
import { getOrderState } from '../../../checkout/reducers/selectors';

import { tap } from 'rxjs/operators';
import { User } from 'src/app/shared/modeles/user';
import { Client } from 'src/app/shared/modeles/client';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {
  signInForm: FormGroup;
  title = environment.AppName;
  loginSubs: Subscription;
  returnUrl: string;
  orderState: string;
  stateSub$: Subscription;
  user:User;
  client:Client;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private oeuvreS:OeuvreService,
    private authService: AuthServiceS) {
    this.stateSub$ = this.store.select(getOrderState)
      .subscribe(state => this.orderState = state);
    this.user=this.authService.getUserConnected();
    this.redirectIfUserLoggedIn() 
  }

  ngOnInit() {
    this.initForm();
    this.redirectIfUserLoggedIn();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParamMap['returnUrl'] || '/';
  }

  onSubmit() {
    const values = this.signInForm.value;
    const keys = Object.keys(values);

    if (this.signInForm.valid) {
      this.loginSubs = this.authService.login(values.email, values.password).subscribe(data => {
        const error = data.error;
        if (error) {
          keys.forEach(val => {
            this.pushErrorFor(val, error);
          });
        }
      });
    } else {
      keys.forEach(val => {
        const ctrl = this.signInForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signInForm.controls[ctrl_name].setErrors({ 'msg': msg });
  }

  initForm() {
    const email = '';
    const password = '';

    this.signInForm = this.fb.group({
      'email': [email, Validators.required],
      'password': [password, Validators.required]
    });
  }

  redirectIfUserLoggedIn() {
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) {
          this.user=this.authService.getUserConnected();
          this.oeuvreS.getClientByUser(parseInt(this.user.id)).subscribe(
            response=>{
              localStorage.setItem('client',JSON.stringify(response));
            }
          );
          this.router.navigate([this.returnUrl]);
          if (this.orderState === 'panier') {
            this.router.navigate(['/checkout', 'cart']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.loginSubs) { this.loginSubs.unsubscribe(); }
  }

}

