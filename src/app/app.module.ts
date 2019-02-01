import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { UsersComponent } from './security/users/users.component';
import { UserRegisterComponent } from './security/users/register.component';
import { UserProfileEditComponent } from './security/users/edit-profile.component';
import { UserEditComponent } from './security/users/edit.component';
import { UserChangePassowordComponent } from './security/users/changepassword.component';
import { BinnacleActionComponent } from './security/binnacle/actions.component';
import { HeaderComponent } from './layout/header.component';
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
    BinnacleActionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
