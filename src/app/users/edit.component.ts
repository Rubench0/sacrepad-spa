import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './user';
import { UserServices } from '../services/user.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'user-edit',
	templateUrl: 'edit.html',
	providers: [UserServices]
})

export class UserEditComponent implements OnInit {
	public title: string;
	public user: User;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public desc_hash;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Modificar datos de usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}

		ngOnInit() {
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				this._route.params.forEach((params: Params) => {
					var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
					this.hash = params['id'];
					this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
					this.roles = [
						{text: 'Usuario',value: 'ROLE_USER'},
						{text: 'Administrador',value: 'ROLE_ADMIN'},
					];
					this._userService.getUser(this.desc_hash).subscribe(
						(response:any) => {
							if(response.status != 'success') {
								this.status = 'error';
								console.log(this.status);
							} else {
								if (response.data.type == '1') {
									this.user = new User(
										response.data.id,
										response.data.login,
										response.data.password,
										response.data.email,
										response.data.rol,
										response.data.name,
										response.data.surname,
										response.data.phone,
										response.data.type,
										"",
										"",
										"",
										"",
									);
								} else if (response.data.type == '2') {
									this.user = new User(
										response.data.id,
										response.data.login,
										response.data.password,
										response.data.email,
										response.data.rol,
										response.data.name,
										response.data.surname,
										response.data.phone,
										response.data.type,
										response.data.identification,
										response.data.profession,
										"",
										"",
									);
								} else if (response.data.type == '3') {
									this.user = new User(
										response.data.id,
										response.data.login,
										response.data.password,
										response.data.email,
										response.data.rol,
										response.data.name,
										response.data.surname,
										response.data.phone,
										response.data.type,
										response.data.identification,
										"",
										response.data.name2,
										response.data.surname2,
									);
								}
								console.log(this.user);
							}
						},
						error => {
							console.log(<any>error)
						}
					);
				});
			}
		}

		onSubmit() {
			this._userService.updateProfile(this.user).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					} else {
						localStorage.setItem('identity', JSON.stringify(this.user));
						//this.hash = CryptoJS.AES.encrypt(this.user.login, 'secret key 123').toString();
						window.location.href = 'users/profile/edit';
					}
				},
				error => {
					console.log(<any>error)
				}
			);
		}
}
