import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'students-edit',
	templateUrl: '../../security/users/edit.html',
	providers: [UserServices]
})

export class StudentEditComponent implements OnInit {
	public title: string;
	public user: User;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public desc_hash;
	public roledit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private location: Location
		){
			this.title = 'Estudiante';
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
					this.user = new User(1,"","","","","","","","","","","","","");
					this._userService.getUser(this.desc_hash).subscribe(
						(response:any) => {
							if(response.status != 'success') {
								this.status = 'error';
								console.log(this.status);
							} else {
								this.user = new User(
									response.data.id,
									response.data.login,
									response.data.password,
									response.data.email,
									response.data.rol,
									response.data.name,
									response.data.surname,
									response.data.phone,
									response.data.identification,
									"",
									response.data.name2,
									response.data.surname2,
									response.data.type,
									""
								);
								this.roledit = false;
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
			this._userService.updateUser(this.user).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					} else {
						this.status = 'success';
					}
				},
				error => {
					console.log(<any>error)
				}
			);
		}

		onBack() {
			this.location.back();
		}

		onDelete() {
			this._userService.deleteUser(this.user).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					} else {
						window.location.href = '/studycontrol/students';
					}
				},
				error => {
					console.log(<any>error)
				}
			);
		}
}
