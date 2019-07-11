/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { User } from './user';
import { UserServices } from '../../services/user.services';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de seguridad que permite registrar usuarios en el sistema.
 * 
 * @export
 * @class UserRegisterComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'users-register',
	templateUrl: 'register.html',
	providers: [UserServices]
})

export class UserRegisterComponent implements OnInit {

	/**
	 * 
	 * 
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {any} user - Instacia de la User.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @memberOf UserRegisterComponent
	 */
	public title: string;
	public user: User;
	public token: string;
	public identity: any;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {MethodsServices} _methodsService Servicio que contiene métodos reutilizables en todo el sistema.
	 * 
	 * @memberOf UserRegisterComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _methodsService: MethodsServices
		){
			this.title = 'Registro de usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.user = new User(1,"","","","","","","","","","","","1","",true);
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
		}

		/**
		 * @method ngOnInit
	 	 * @description Método que permite ejecutar código de inicialización.
	 	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
		 * 
		 * @memberOf UserRegisterComponent
		 */
		ngOnInit() {
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else if(this.identity.rol != 'ROLE_ADMIN') {
				this._router.navigate(['/firewall']);
			} else {

			}
		}

		/**
		 * @method onBack
	 	 * @description Método que permite volver a la vista de usuarios.
	 	 * Redirige a la vista de usuairos.
		 * 
		 * @memberOf UserRegisterComponent
		 */
		onBack() {
			this._router.navigate(['/users']);
		}

		/**
		 * @method onSubmit
		 * @description Permite registar usuario.
		 * Suscribe al servicio _userService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
		 * De no ser exitoso genera un error el cual se muestra en pantalla.
		 *
		 * @memberOf UserRegisterComponent
		 */
		onSubmit() {
			this.loading = true;
			this._userService.register(this.user).subscribe(
				(response:any) => {
					this.loading = false;
					if (response.status != 'success') {
						this.loading = false;
						this.msgError = true;
						this.msg = 'Error en el servidor, contacte al administrador.';
						this._methodsService.errorAlert().then((res)=>{
							this.msgError = res;
						});
					} else {
						this.msg = response.msg;
						this.msgSuccess = true;
						this._methodsService.errorAlert().then((res)=>{
							this.msgSuccess = res;
						});
					}
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this._methodsService.errorAlert().then((res)=>{
						this.msgError = res;
					});
				}
			);
		}
}
