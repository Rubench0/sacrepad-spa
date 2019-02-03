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
}