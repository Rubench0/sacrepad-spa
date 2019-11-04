import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
import { SubjectRegisterComponent } from './studycontrol/subject/register.component';
import { SubjectsComponent } from './studycontrol/subject/subject.component';
import { SubjectEditComponent } from './studycontrol/subject/edit.component';
import { LectionRegisterComponent } from './studycontrol/lection/register.component';
import { LectionsComponent } from './studycontrol/lection/lection.component';
import { LectionEditComponent } from './studycontrol/lection/edit.component';
import { CohortInscriptionsComponent } from './studycontrol/inscription/cohort_inscription.component';
import { InscriptionsComponent } from './studycontrol/inscription/inscriptions.component';

import { DaysRegisterComponent } from './configuration/days/register.component';
import { DaysComponent } from './configuration/days/days.component';
import { DaysEditComponent } from './configuration/days/edit.component';
import { ClassificationSubjectRegisterComponent } from './configuration/classificationsubject/register.component';
import { ClassificationSubjectComponent } from './configuration/classificationsubject/classificationsubject.component';
import { ClassificationSubjectEditComponent } from './configuration/classificationsubject/edit.component';
import { TypeSubjectRegisterComponent } from './configuration/typessubject/register.component';
import { TypeSubjectComponent } from './configuration/typessubject/typessubject.component';
import { TypeSubjectEditComponent } from './configuration/typessubject/edit.component';
import { RequirementStudentRegisterComponent } from './configuration/requirementsstudent/register.component';
import { RequirementStudentComponent } from './configuration/requirementsstudent/requirementsstudent.component';
import { RequirementStudentEditComponent } from './configuration/requirementsstudent/edit.component';
import { CohortRegisterComponent } from './configuration/cohort/register.component';
import { CohortComponent } from './configuration/cohort/cohort.component';
import { CohortEditComponent } from './configuration/cohort/edit.component';
import { ClassRoomRegisterComponent } from './configuration/classroom/register.component';
import { ClassRoomComponent } from './configuration/classroom/classroom.component';
import { ClassRoomEditComponent } from './configuration/classroom/edit.component';

import { HomeComponent } from './default/home.component';
import { FirewallComponent } from './default/firewall.component';
import { SubjectsFacilitatorComponent } from './studycontrol/facilitator/subjectsfacilitator';
import { SubjectsStudentComponent } from './studycontrol/student/subjectstudent.component';
import { SubjectViewFacilitatorComponent } from './studycontrol/lection/view_facilitator.component';
import { CohortStudentComponent } from './studycontrol/inscription/cohort_student.component';
import { ViewStudentInscriptionComponent } from './studycontrol/inscription/view_student.component';
import { AboutComponent } from './layout/about/about.component';
import { PreinscriptionComponent } from './studycontrol/student/preinscription/preinscription.component';
import { DatabaseComponent } from './security/database/database.component';

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
    FirewallComponent,
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
    TypeSubjectEditComponent,
    RequirementStudentRegisterComponent,
    RequirementStudentComponent,
    RequirementStudentEditComponent,
    CohortRegisterComponent,
    CohortComponent,
    CohortEditComponent,
    ClassRoomRegisterComponent,
    ClassRoomComponent,
    ClassRoomEditComponent,
    SubjectRegisterComponent,
    SubjectsComponent,
    SubjectEditComponent,
    LectionRegisterComponent,
    LectionsComponent,
    LectionEditComponent,
    CohortInscriptionsComponent,
    InscriptionsComponent,
    SubjectsFacilitatorComponent,
    SubjectsStudentComponent,
    SubjectViewFacilitatorComponent,
    CohortStudentComponent,
    ViewStudentInscriptionComponent,
    AboutComponent,
    PreinscriptionComponent,
    DatabaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
