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
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import { ValidationPatterns } from 'src/app/objets/validation';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de configuración que permite registrar facilitadores.
 *
 * @export
 * @class FacilitatorRegisterComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'facilitator-register',
	templateUrl: 'register.html',
	providers: [UserServices,MethodsServices]
})

export class FacilitatorRegisterComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {User} facilitator - Instacia del objeto User.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @memberOf FacilitatorRegisterComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public facilitator: User;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public validationsPatterns: ValidationPatterns;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf FacilitatorRegisterComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		public _methodsServices: MethodsServices,
		){
		this.title = 'Registro de facilitador';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.facilitator = new User(1,"","","","","","","","","","","","2","",true);
		this.loading = false;
		this.msgError = false;
		this.msgSuccess = false;
		this.validationsPatterns = new ValidationPatterns();
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 *
	 * @memberOf FacilitatorRegisterComponent
	 */
	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {}
	}

	/**
	 * @method onBack
	 * @description Método que permite volver a la vista de facilitadores.
	 * Redirige a la vista de facilitadores.
	 *
	 * @memberOf FacilitatorRegisterComponent
	 */
	onBack() {
		this._router.navigate(['/studycontrol/facilitators']);
	}

	/**
	 * @method onSubmit
	 * @description Permite registar los facilitadores.
	 * Suscribe al servicio _userService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf FacilitatorRegisterComponent
	 */
	onSubmit() {
		this.loading = true;
		this._userService.register(this.facilitator).subscribe(
			(response:any) => {
				this.loading = false;
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.msg = response.msg;
					this.msgSuccess = true;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});
				}
			},
			error => {
				//console.log(<any>error);
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsServices.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
	}
}
