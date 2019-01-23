import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../services/user.services';

@Component({
	selector: 'home',
	templateUrl: 'home.html',
	providers: [UserServices]
})

export class HomeComponent implements OnInit {
	public title: string;
	public status;
	public token;
	public identity;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Bienvenid@';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}

		ngOnInit(){
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				//console.log('Componente home cargado con exito');
			}
		}
}
