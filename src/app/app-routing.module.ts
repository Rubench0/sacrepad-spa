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
import { FacilitatorRegisterComponent } from './studycontrol/facilitator/register.component';
import { FacilitatorsEditComponent } from './studycontrol/facilitator/edit.component';
import { FacilitatorsComponent } from './studycontrol/facilitator/facilitators.component';
import { StudentRegisterComponent } from './studycontrol/student/register.component';
import { StudentEditComponent } from './studycontrol/student/edit.component';
import { StudentsComponent } from './studycontrol/student/students.component';
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
	{path: 'studycontrol/facilitator/new', component: FacilitatorRegisterComponent},
	{path: 'studycontrol/facilitator/edit/:id', component: FacilitatorsEditComponent},
	{path: 'studycontrol/facilitators', component: FacilitatorsComponent},
	{path: 'studycontrol/student/new', component: StudentRegisterComponent},
	{path: 'studycontrol/students', component: StudentsComponent},
	{path: 'studycontrol/student/edit/:id', component: StudentEditComponent},
	{path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
