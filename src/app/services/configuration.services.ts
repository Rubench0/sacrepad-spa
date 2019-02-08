import { Injectable } from '@angular/core';
import { HttpClient , HttpResponse , HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { UserServices } from './user.services';

@Injectable() 
export class ConfigurationServices {
	public url: string;
	public identity;
	public token;

	constructor(
		private _http: HttpClient,
		private _userService: UserServices
	) {
		this.url = GLOBAL.url;
	}

	daysRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/days/new', params, {headers: headers});
	}

	viewsDays() {
		let params = "authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/days', params, {headers: headers});
	}

	getData(id,table) {
		let params = "authorization="+this._userService.getToken()+"&id="+id+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/get/data', params, {headers: headers});
	}

	updateData(form,table) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken()+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/edit/data', params, {headers: headers});
	}

	deleteDatas(form,table) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken()+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/delete/data', params, {headers: headers});
	}

	classSubjectRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/nclasssubject/new', params, {headers: headers});
	}

	viewsclassSubject() {
		let params = "authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/nclasssubject', params, {headers: headers});
	}

	typeSubjectRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/typesubject/new', params, {headers: headers});
	}	


	viewstypeSubject() {
		let params = "authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/typesubject', params, {headers: headers});
	}

	requireStudentRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/requirementstudent/new', params, {headers: headers});
	}

	viewsrequiremetStudent() {
		let params = "authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/requirementstudents', params, {headers: headers});
	}

	cohortRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/cohort/new', params, {headers: headers});
	}

	viewsCohort() {
		let params = "authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/cohort', params, {headers: headers});
	}

	getCohort(id) {
		let params = "authorization="+this._userService.getToken()+"&id="+id;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/cohort/get', params, {headers: headers});
	}

	updateCohort(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/edit/cohort', params, {headers: headers});
	}

	deleteCohort(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/configuration/delete/cohort', params, {headers: headers});
	}

}