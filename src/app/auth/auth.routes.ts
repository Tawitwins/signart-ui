import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { CompteComponent } from './components/compte/compte.component';
import { ApplyComponent } from './components/apply/apply.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

export const AuthRoutes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: CompteComponent},
  {path:'apply', component:ApplyComponent},
  {path:'resetpassword', component: ResetPasswordComponent},
  {path:'usermanagement', component: UserManagementComponent}
];
