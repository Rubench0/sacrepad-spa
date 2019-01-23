import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './users/register.component';
import { UserEditComponent } from './users/edit.component';
import { HomeComponent } from './default/home.component';

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'logout/:id', component: LoginComponent},
	{path: 'users/register', component: UserRegisterComponent},
	{path: 'users/edit', component: UserEditComponent},
	{path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
