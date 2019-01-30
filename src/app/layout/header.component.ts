import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../services/user.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'header-nav',
	templateUrl: 'header.html',
	providers: [UserServices]
})

export class HeaderComponent implements OnInit {
	public title: string;
	public user;
	public identity;
	public token;
	public crypoidentity;

	constructor(
		private _userService: UserServices,
		) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		if (this.identity != null) {
			this.crypoidentity = CryptoJS.AES.encrypt(this.identity.login, 'secret key 123').toString();
		}
	}
	ngOnInit(){
		
	}
}
