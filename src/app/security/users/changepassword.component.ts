import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChangePassword } from './changepassword';
import { UserServices } from '../../services/user.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'changepassword',
	templateUrl: 'changepassword.html',
	providers: [UserServices]
})

export class UserChangePassowordComponent implements OnInit {
	public title: string;
	public status;
	public token;
	public identity;
	public form: ChangePassword;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Modificar contraseña de usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}

		ngOnInit() {
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				this.form = new ChangePassword(this.identity.id,"","",);
			}
		}

		onSubmit() {
			this._userService.updateChangePw(this.form).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					} else {
						this.status = 'success';
						alert('Contraseña actualizada exitosamente, ingrese sesión nuevamente');
						this._router.navigate(['/logout',1]);
					}
				},
				error => {
					console.log(<any>error)
				}
			);
		}
}
