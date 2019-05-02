import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../services/user.services';

@Component({
	selector: 'firewall',
	templateUrl: 'firewall.html',
	providers: [UserServices]
})

export class FirewallComponent implements OnInit {
	public _user: string;
	public status;
	public token;
	public identity;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this._user = this.identity.login;
		}

		ngOnInit(){
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				//console.log('Componente home cargado con exito');
			}
		}
}
