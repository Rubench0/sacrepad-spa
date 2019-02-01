import { Injectable } from '@angular/core';
import { HttpClient , HttpResponse , HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable() 
export class UserServices {
	public url: string;
	public identity;
	public token;

	constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
	}

	singup(user_to_login) {
		let json = JSON.stringify(user_to_login);
		let params = "json= "+json;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/login', params, {headers: headers});
	}

	getIdentity() {
		let identity = JSON.parse(localStorage.getItem('identity'));
		if (identity != 'undefined') {
			this.identity = identity;
		} else {
			this.identity = identity;
		}

		return this.identity;
	}

	getToken() {
		let token = JSON.parse(localStorage.getItem('token'));
		if (token != 'undefined') {
			this.token = token;
		} else {
			this.token = token;
		}

		return this.token;
	}

	getUser(user) {
		let params = "authorization="+this.getToken()+"&id="+user;
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/get', params, {headers: headers});
	}

	register(user) {
		let json = JSON.stringify(user);
		let params = "form="+json+"&authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/new', params, {headers: headers});
	}

	views() {
		let params = "authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/all', params, {headers: headers});
	}
	
	updateProfile(user) {
		let json = JSON.stringify(user);
		let params = "form="+json+"&authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/profile/edit', params, {headers: headers});
	}

	updateChangePw(user) {
		let json = JSON.stringify(user);
		let params = "form="+json+"&authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/changepassword', params, {headers: headers});
	}

	updateUser(user) {
		let json = JSON.stringify(user);
		let params = "form="+json+"&authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/edit', params, {headers: headers});
	}
	deleteUser(user) {
		let json = JSON.stringify(user);
		let params = "form="+json+"&authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/user/delete', params, {headers: headers});
	}
}