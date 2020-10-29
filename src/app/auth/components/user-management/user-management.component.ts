import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserManagementActions } from 'app/shared/services/enums.enum';
import { takeUntil } from 'rxjs/operators';
import { AuthServiceS } from 'app/shared/services/auth.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit , OnDestroy{

  ngUnsubscribe: Subject<any> = new Subject<any>();
  actions = UserManagementActions;

  // The user management actoin to be completed
  mode: string;
  // Just a code Firebase uses to prove that
  // this is a real password reset.
  actionCode: string;

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  actionCodeChecked: boolean;
  newPasswordForm: FormGroup;
  hide: boolean;
  mail: string;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthServiceS,
    private   fb: FormBuilder
  ) { }
  initForm() {
    const newpassword = '';
    const confirm_password = '';

    this.newPasswordForm = this.fb.group({
      'newpassword': [newpassword, Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirmation': [confirm_password, Validators.compose([Validators.required, Validators.minLength(6)])]
    },
    { validator: this.matchingPasswords('newpassword', 'confirmation') });
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

  ngOnInit() {
    this.initForm();
    this.hide = true;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        // if we didn't receive any parameters, 
        // we can't do anything
        if (!params) this.router.navigate(['/home']);

        this.mode = params['mode'];
        this.actionCode = params['oobCode'];

        switch (params['mode']) {
          case UserManagementActions.resetPassword: {
            // Verify the password reset code is valid.
            this.authService
            .getAuth()
            .verifyPasswordResetCode(this.actionCode)
            .then(email => {
              this.actionCodeChecked = true;
              this.mail = email;
              console.log('email ', email)
            }).catch(e => {
              // Invalid or expired action code. Ask user to try to
              // reset the password again.
              alert(e);
              this.router.navigate(['/auth/login']);
            });
          } break
          case UserManagementActions.recoverEmail: {

          } break
          case UserManagementActions.verifyEmail: {

          } break
          default: {
            console.log('query parameters are missing');
            this.router.navigate(['/auth/login']);
          }
        }
      })
  }

  ngOnDestroy() {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
  handleResetPassword() {
    let formvalue = this.newPasswordForm.value;
    console.log('fv ', formvalue)
    this.newPassword = formvalue.newpassword;
    this.confirmPassword = formvalue.confirmation;
    if (this.newPassword != this.confirmPassword) {
      alert('New Password and Confirm Password do not match');
      return;
    }
    // Save the new password.
    this.authService.getAuth().confirmPasswordReset(
        this.actionCode,   
        this.newPassword
    )
    .then(resp => {
      // Password reset has been confirmed and new password updated.
      $.notify({
        icon: "notifications",
        message: "Votre mot de passe a été mis à jour avec succès !"
      }, {
          type: 'success',
          timer: 3000,
          placement: {
            from: 'top',
            align: 'center'
          }
        });
      //alert('New password has been saved');
      this.router.navigate(['/auth/login']);
    }).catch(e => {
      // Error occurred during confirmation. The code might have
      // expired or the password is too weak.
      alert(e);
    });
  }

}