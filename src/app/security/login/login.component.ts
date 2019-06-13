/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubén García <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.services';

/**
 * Componente de seguridad para abrir sesión de usuario en el sistema.
 *
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */

@Component({
	selector: 'login',
	templateUrl: 'login.html',
	providers: [UserServices]
})

export class LoginComponent implements OnInit {
	/**
	 *
	 *
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @memberOf LoginComponent
	 */
	public title: string;
	public user;
	public loading;
	public identity;
	public token;
	public msg;
	public msgError;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Inicia sesión en Sacrepad';
			this.loading = false;
			this.msgError = false;
			this.user = {
				"email" : "",
				"password" : "",
				"getHash" : "true"
			};
		}

		ngOnInit(){
			//console.log(this._userService.getIdentity());
			//console.log(this._userService.getToken());
			this.logout();
			this.redirectIfIdentity();

		}

		logout() {
			this._route.params.forEach((params: Params) => {
				let logout = +params['id'];
				if (logout == 1) {
					localStorage.removeItem('identity');
					localStorage.removeItem('token');

					this.identity = null;
					this.token = null;

					window.location.href = '/login';
				}
			});
		}

		redirectIfIdentity() {
			let identity = this._userService.getIdentity();
			if (identity != null && identity.sub) {
				this._router.navigate(['/']);
			}
		}

		errorAlert() {
			setTimeout(() => {
				this.msgError = false;
			}, 5000);
		}

		onSubmit() {
			this.loading = true;
			this._userService.singup(this.user).subscribe(
				(response: any) => {
					if (response.status == 'error') {
						this.loading = false;
						this.msgError = true;
						this.msg = response.msg;
						this.errorAlert();
					} else {
						this.identity = response.data;
						localStorage.setItem('identity', JSON.stringify(this.identity));
						//  guardando token en el localstorage
						this.user.getHash = null;
						this._userService.singup(this.user).subscribe(
							(response: any) => {
								this.loading = false;
								if (response.status == 'error') {
									this.msgError = true;
									this.msg = response.msg;
									this.errorAlert();
								} else {
									this.token = response.data;
									localStorage.setItem('token', JSON.stringify(this.token));
									window.location.href = '/';
								}
							},
							error => {
								this.loading = false;
								//console.log(<any>error);
								this.msgError = true;
								this.msg = 'Error en el servidor, contacte al administrador.';
								this.errorAlert();
							},
						);
					}
				},
				error => {
					this.loading = false;
					//console.log(<any>error);
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				},
			);
		}
}
