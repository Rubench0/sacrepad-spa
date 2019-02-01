import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { UsersComponent } from './security/users/users.component';
import { UserRegisterComponent } from './security/users/register.component';
import { UserProfileEditComponent } from './security/users/edit-profile.component';
import { UserEditComponent } from './security/users/edit.component';
import { UserChangePassowordComponent } from './security/users/changepassword.component';
import { BinnacleActionComponent } from './security/binnacle/actions.component';
import { BinnacleAccessComponent } from './security/binnacle/access.component';
import { HomeComponent } from './default/home.component';

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'logout/:id', component: LoginComponent},
	{path: 'users', component: UsersComponent},
	{path: 'users/register', component: UserRegisterComponent},
	{path: 'users/edit/:id', component: UserEditComponent},
	{path: 'users/profile/edit', component: UserProfileEditComponent},
	{path: 'users/profile/password', component: UserChangePassowordComponent},
	{path: 'security/binnacle/actions', component: BinnacleActionComponent},
	{path: 'security/binnacle/access', component: BinnacleAccessComponent},
	{path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
