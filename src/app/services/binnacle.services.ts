import { Injectable } from '@angular/core';
import { HttpClient , HttpResponse , HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable() 
export class BinnacleServices {
	public url: string;
	public identity;
	public token;

	constructor(private _http: HttpClient) {
		this.url = GLOBAL.url;
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

	getActions() {
		let params = "authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/security/binnacle/actions', params, {headers: headers});
	}	

	getAccess() {
		let params = "authorization="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
		return this._http.post(this.url+'/security/binnacle/access', params, {headers: headers});
	}

}