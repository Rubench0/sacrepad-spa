import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './user';
import { UserServices } from '../../services/user.services';

@Component({
	selector: 'users-register',
	templateUrl: 'register.html',
	providers: [UserServices]
})

export class UserRegisterComponent implements OnInit {
	public title: string;
	public user: User;
	public status;
	public token;
	public identity;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private location: Location,
		private _userService: UserServices
		){
			this.title = 'Componente de register';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.user = new User(1,"","","","","","","","","","","","1");
		}

		ngOnInit() {
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				//console.log('Componente register cargado con exito');
			}
		}

		onBack() {
			this.location.back();
		}

		onSubmit() {
			this._userService.register(this.user).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		}
}
