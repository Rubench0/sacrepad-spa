/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePassword } from './changepassword';
import { UserServices } from '../../services/user.services';
import { ValidationPatterns } from '../../objets/validation';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de seguridad que permite cambiar la contraseña de usuarios en el sistema.
 * 
 * @export
 * @class UserChangePassowordComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'changepassword',
	templateUrl: 'changepassword.html',
	providers: [UserServices,MethodsServices]
})

export class UserChangePassowordComponent implements OnInit {
	
	/**
	 * 
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {ChangePassword} form - Instacia del objeto ChangePassword.
	 * @type {any} roles - Arreglo que contiene los roles del sistema.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 *
	 * @memberOf UserChangePassowordComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public form: ChangePassword;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public validationsPatterns: ValidationPatterns;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {MethodsServices} _methodsService Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf UserChangePassowordComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _methodsService: MethodsServices
		){
			this.title = 'Modificar contraseña de usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
			this.validationsPatterns = new ValidationPatterns();
		}

		/**
		 * @method ngOnInit
		 * @description Método que permite ejecutar código de inicialización.
		 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall, si el valido obtiene el hash enviado desde la ruta, una vez obtenido el hash es desencriptado para identificar el usuario.
		 * Se inicia una instancia del objeto ChangePassword para interactuar con el formulario y poder asignar los cambios de contraseña.
		 *
		 * @memberOf UserChangePassowordComponent
		 */
		ngOnInit() {
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				this.form = new ChangePassword(this.identity.id,"","",);
			}
		}

		/**
		 * @method onSubmit
	 	 * @description Permite cambiar la contraseña de usuario.
	 	 * Suscribe al servicio _userService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 	 * De no ser exitoso genera un error el cual se muestra en pantalla.
		 * 
		 * @memberOf UserChangePassowordComponent
		 */
		onSubmit() {
			this.loading = true;
			this._userService.updateChangePw(this.form).subscribe(
				(response:any) => {
					this.loading = false;
					if(response.status != 'success') {
						this.msgError = true;
						this.msg = response.msg;
						this._methodsService.errorAlert().then((res)=>{
							this.msgError = res;
						});
					} else {
						this.msg = response.msg;
						this.msgSuccess = true;
						this._methodsService.errorAlert().then((res)=>{
							this.msgSuccess = res;
							this._router.navigate(['/logout',1]);
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
