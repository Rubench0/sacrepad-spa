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

	viewsSubject() {
		let params = "authorization="+this._userService.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/studycontrol/subjects', params, {headers: headers});
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

}