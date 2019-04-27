import { Injectable } from '@angular/core';
import { HttpClient , HttpResponse , HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { UserServices } from './user.services';

@Injectable()
export class StudycontrolServices {
	public url: string;
	public identity;
	public token;

	constructor(
		private _http: HttpClient,
		private _userService: UserServices
	) {
		this.url = GLOBAL.url;
	}

	subjectRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/subject/new', params, {headers: headers});
	}

	get_selects(table) {
		let params = "authorization="+this._userService.getToken()+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/get/selects', params, {headers: headers});
	}
	
	get_lections(id_cohort) {
		let params = "authorization="+this._userService.getToken()+"&id_cohort="+id_cohort;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/get/lections', params, {headers: headers});
	}

	get_selects_not_auth(table) {
		let params = "&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/get/notauth/selects', params, {headers: headers});
	}

	viewsDatatable(table) {
		let params = "authorization="+this._userService.getToken()+'&table='+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/data/tables', params, {headers: headers});
	}

	getData(id,table) {
		let params = "authorization="+this._userService.getToken()+"&id="+id+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/get/data', params, {headers: headers});
	}

	updateData(form,table) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken()+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/edit/data', params, {headers: headers});
	}

	deleteDatas(form,table) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken()+"&table="+table;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/delete/data', params, {headers: headers});
	}

	lectionRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/lection/new', params, {headers: headers});
	}

	hasClassRegister(form) {
		let json = JSON.stringify(form);
		let params = "form="+json+"&authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/hasclass/new', params, {headers: headers});
	}

	viewsDatatableDays(id) {
		let params = "authorization="+this._userService.getToken()+'&id='+id;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/data/daysclass', params, {headers: headers});
	}

	deleteSchedule(id_day,id_class) {
		let params = "id_day="+id_day+"&authorization="+this._userService.getToken()+"&id_class="+id_class;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/delete/schedule', params, {headers: headers});
	}

	viewsDatatableStudentInscription(id) {
		let params = "authorization="+this._userService.getToken()+'&id='+id;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/data/inscription_students', params, {headers: headers});
	}

	searchStudent(cedula) {
		let params = "authorization="+this._userService.getToken()+'&cedula='+cedula;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/data/search_student', params, {headers: headers});
	}

	InscriptionStudent(id_student,id_class) {
		let params = "id_student="+id_student+"&authorization="+this._userService.getToken()+"&id_class="+id_class;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/inscription/student', params, {headers: headers});
	}

	deleteUnsubscribe(_id_student_d,id_class) {
		let params = "id_student="+_id_student_d+"&authorization="+this._userService.getToken()+"&id_class="+id_class;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/unsubscribe/student', params, {headers: headers});
	}

	aprovedInscription(id_inscription,id_cohort,selected) {
		let json = JSON.stringify(selected);
		let params = "id_inscription=" + id_inscription + "&authorization=" + this._userService.getToken() + "&id_cohort=" + id_cohort+ "&selected=" + json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/aproved/inscription', params, {headers: headers});
	}

}