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
import { SubjectViewFacilitatorComponent } from './studycontrol/lection/view_facilitator.component';
import { CohortStudentComponent } from './studycontrol/inscription/cohort_student.component';
import { ViewStudentInscriptionComponent } from './studycontrol/inscription/view_student.component';
import { AboutComponent } from './layout/about/about.component';
import { PreinscriptionComponent } from './studycontrol/student/preinscription/preinscription.component';

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'about', component: AboutComponent},
	{path: 'login', component: LoginComponent},
	{path: 'firewall', component: FirewallComponent},
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
	{path: 'studycontrol/subject/new', component: SubjectRegisterComponent},
	{path: 'studycontrol/subjects', component: SubjectsComponent},
	{path: 'studycontrol/subject/edit/:id', component: SubjectEditComponent},
	{path: 'studycontrol/lection/new', component: LectionRegisterComponent},
	{path: 'studycontrol/lections', component: LectionsComponent},
	{path: 'studycontrol/lection/edit/:id', component: LectionEditComponent},
	{path: 'studycontrol/inscriptions', component: CohortInscriptionsComponent },
	{path: 'studycontrol/lection/inscriptions/:id', component: InscriptionsComponent},
	{path: 'studycontrol/lection/facilitator/:id', component: SubjectViewFacilitatorComponent},
	{path: 'studycontrol/cohorts/student', component: CohortStudentComponent},
	{path: 'studycontrol/cohort/student/:id', component: ViewStudentInscriptionComponent},
	{path: 'studycontrol/preinscrition/new', component: PreinscriptionComponent},
	
	{path: 'configuration/days/new', component: DaysRegisterComponent},
	{path: 'configuration/days', component: DaysComponent},
	{path: 'configuration/days/edit/:id', component: DaysEditComponent},
	{path: 'configuration/classificationsubject/new', component: ClassificationSubjectRegisterComponent},
	{path: 'configuration/classificationsubjects', component: ClassificationSubjectComponent},
	{path: 'configuration/classificationsubject/edit/:id', component: ClassificationSubjectEditComponent},
	{path: 'configuration/typessubject/new', component: TypeSubjectRegisterComponent},
	{path: 'configuration/typessubjects', component: TypeSubjectComponent},
	{path: 'configuration/typessubject/edit/:id', component: TypeSubjectEditComponent},
	{path: 'configuration/requirementstudent/new', component: RequirementStudentRegisterComponent},
	{path: 'configuration/requirementstudents', component: RequirementStudentComponent},
	{path: 'configuration/requirementstudents/edit/:id', component: RequirementStudentEditComponent},
	{path: 'configuration/cohort/new', component: CohortRegisterComponent},
	{path: 'configuration/cohorts', component: CohortComponent},
	{path: 'configuration/cohort/edit/:id', component: CohortEditComponent},
	{path: 'configuration/classroom/new', component: ClassRoomRegisterComponent},
	{path: 'configuration/classrooms', component: ClassRoomComponent},
	{path: 'configuration/classroom/edit/:id', component: ClassRoomEditComponent},
	{path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
