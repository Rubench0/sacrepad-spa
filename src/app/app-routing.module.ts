import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { UserRegisterComponent } from './users/register.component';
import { UserProfileEditComponent } from './users/edit-profile.component';
import { UserEditComponent } from './users/edit.component';
import { UserChangePassowordComponent } from './users/changepassword.component';
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
	{path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
