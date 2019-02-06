import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header.component';

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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegisterComponent,
    UserProfileEditComponent,
    UserEditComponent,
    UserChangePassowordComponent,
    UsersComponent,
    HeaderComponent,
    HomeComponent,
    BinnacleActionComponent,
    BinnacleAccessComponent,
    FacilitatorRegisterComponent,
    FacilitatorsEditComponent,
    FacilitatorsComponent,
    StudentRegisterComponent,
    StudentEditComponent,
    StudentsComponent,
    DaysRegisterComponent,
    DaysComponent,
    DaysEditComponent,
    ClassificationSubjectRegisterComponent,
    ClassificationSubjectComponent,
    ClassificationSubjectEditComponent,
    TypeSubjectRegisterComponent,
    TypeSubjectComponent,
    TypeSubjectEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
