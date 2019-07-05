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
import { MethodsServices } from '../../services/methods.services';
import { ValidationPatterns } from '../../validation/validation';

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
	providers: [UserServices,MethodsServices]
})

export class LoginComponent implements OnInit {
	/**
	 *
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {any} user - Se usa para almacenar información del usuario.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} msgError - Variable utilizadapara mostrar el mensaje de error.
	 * @type {object} validationsPatterns - Objeto que almacena los patrones de validación del sistema.
	 * @memberOf LoginComponent
	 */
	public title: string;
	public user: any;
	public loading: boolean;
	public identity: any;
	public token: string;
	public msg: string;
	public msgError: any;
	public validationsPatterns: ValidationPatterns;

	/**
	 * @description Constructor del componente, en el podemos cargar funcionalidades 
	 * @param _route Contiene información sobre una ruta asociada y permite gestionar datos de la ruta
	 * @param _router Permite gestionar el sistema de rutas de angular 
	 * @param _userService Servicios para la gestión de usuarios.
	 * @param _methodsService Servicio que contiene métodos reutilizables en todo el sistema.
	 */

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _methodsService: MethodsServices
		) {
			this.title = 'Inicia sesión en Sacrepad';
			this.loading = false;
			this.msgError = false;
			this.user = {
				"email" : "",
				"password" : "",
				"getHash" : "true"
			};
			this.validationsPatterns = new ValidationPatterns();
		}
	
	/**
	 * @function ngOnInit
	 * @description Método que permite ejecutar código de inicialización. Se cargan los métodos logout y redirectIfIdentity.
	 * 
	 * 
	 * @memberOf LoginComponent
	 */
	ngOnInit(){
		this.logout();
	}

	/**
	 * @function logout
	 * @description Método para cerrar sesión de usuario. Se utiliza el servicio _route para saber cual es el id de usuario y se procede a borrar del localStorage la información de sesión, una vez borrada se redirecciona a la ruta /login.
	 * 
	 * 
	 * @memberOf LoginComponent
	 */

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

	/**
	 * @method onSubmit
	 * @description Permite iniciar sesión de usuario. Suscribe al servicio _userService para verificar si los datos son correctos, primero traer los datos del usuario para agregarlos al LocalStorage y luego trae el token de acceso, retornando a la vista principal del sistema de ser exitoso. De no ser exitoso genera un error el cual se muestra en pantalla.
	 * 
	 * @memberOf LoginComponent
	 */
	onSubmit() {
		this.loading = true;
		this._userService.singup(this.user).subscribe(
			(response: any) => {
				if (response.status == 'error') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this._methodsService.errorAlert().then((res)=>{
						this.msgError = res;
					});
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
								this._methodsService.errorAlert().then((res)=>{
									this.msgError = res;
								});
							} else {
								this.token = response.data;
								localStorage.setItem('token', JSON.stringify(this.token));
								window.location.href = '/';
							}
						},
						error => {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this._methodsService.errorAlert().then((res)=>{
								this.msgError = res;
							});
						},
					);
				}
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsService.errorAlert().then((res)=>{
					this.msgError = res;
				});
			},
		);
	}
}
