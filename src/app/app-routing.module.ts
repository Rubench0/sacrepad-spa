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

import { DaysRegisterComponent } from './configuration/days/register.component';
import { DaysComponent } from './configuration/days/days.component';
import { DaysEditComponent } from './configuration/days/edit.component';
import { ClassificationSubjectRegisterComponent } from './configuration/classificationsubject/register.component';
import { ClassificationSubjectComponent } from './configuration/classificationsubject/classificationsubject.component';
import { ClassificationSubjectEditComponent } from './configuration/classificationsubject/edit.component';
import { TypeSubjectRegisterComponent } from './configuration/typessubject/register.component';
import { TypeSubjectComponent } from './configuration/typessubject/typessubject.component';
import { TypeSubjectEditComponent } from './configuration/typessubject/edit.component';

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
	{path: 'configuration/days/new', component: DaysRegisterComponent},
	{path: 'configuration/days', component: DaysComponent},
	{path: 'configuration/days/edit/:id', component: DaysEditComponent},
	{path: 'configuration/classificationsubject/new', component: ClassificationSubjectRegisterComponent},
	{path: 'configuration/classificationsubjects', component: ClassificationSubjectComponent},
	{path: 'configuration/classificationsubject/edit/:id', component: ClassificationSubjectEditComponent},
	{path: 'configuration/typessubject/new', component: TypeSubjectRegisterComponent},
	{path: 'configuration/typessubjects', component: TypeSubjectComponent},
	{path: 'configuration/typessubject/edit/:id', component: TypeSubjectEditComponent},
	{path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
