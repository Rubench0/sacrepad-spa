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
	public msg;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Modificar contraseña de usuario';
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
				this.form = new ChangePassword(this.identity.id,"","",);
			}
		}

		onSubmit() {
			this.loading = true;
			this._userService.updateChangePw(this.form).subscribe(
				(response:any) => {
					this.loading = false;
					this.status = response.status;
					if(response.status != 'success') {
						this.msgError = true;
						this.msg = response.msg;
						setTimeout(() => {
							this.msgError = false;
						}, 5000);
					} else {
						this.msg = response.msg;
						this.msgSuccess = true;
						setTimeout(() => {
							this.msgSuccess = false;
						}, 5000);
						this._router.navigate(['/logout',1]);
					}
				},
				error => {
					console.log(<any>error)
				}
			);
		}
}
