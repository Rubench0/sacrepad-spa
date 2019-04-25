import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './user';
import { UserServices } from '../../services/user.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'user-profile-edit',
	templateUrl: 'edit-profile.html',
	providers: [UserServices]
})

export class UserProfileEditComponent implements OnInit {
	public title: string;
	public user: User;
	public status;
	public token;
	public identity;
	public roles;
	public msg;
	public msgError;
	public msgSuccess;
	public loading;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Modificar datos de usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this.user = new User(
				this.identity.id,
				this.identity.login,
				"",
				this.identity.email,
				this.identity.rol,
				this.identity.name,
				this.identity.surname,
				this.identity.phone,
				"",
				"",
				"",
				"",
				"",
				"",
			);
		}
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onSubmit() {
		this.loading = true;
		this._userService.updateProfile(this.user).subscribe(
			(response:any) => {
				this.status = response.status;
				this.loading = false;
				if(response.status != 'success') {
					this.msgError = true;
					this.msg = response.msg;
					this.errorAlert();
				} else {
					this.msg = response.msg;
					this.msgSuccess = true;
					setTimeout(() => {
						this.msgSuccess = false;
					}, 5000);
					localStorage.setItem('identity', JSON.stringify(this.user));
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}
}
