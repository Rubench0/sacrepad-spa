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
import { ModelConfiguration } from '../model-configuration';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import { MethodsServices } from '../../services/methods.services';

/**
 * Componente de configuración que permite registrar los tipos de asignatura.
 *
 * @export
 * @class TypeSubjectRegisterComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
	selector: 'classification-subject-register',
	templateUrl: '../register-modelconfiguration.html',
	providers: [UserServices,ConfigurationServices,MethodsServices]
})

export class TypeSubjectRegisterComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} label_input - Variable utilizada para el label de los botones.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {ModelConfiguration} modelconfiguration - Instacia del objeto ModelConfiguration.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @memberOf TypeSubjectRegisterComponent
	 */
	public title: string;
	public label_input: string;
	public token: string;
	public identity: any;
	public modelconfiguration: ModelConfiguration;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {ConfigurationServices} _configurationService Servicios para la gestión de datos de configuración.
	 * @param {MethodsServices} _methodsService Servicio que contiene métodos reutilizables en todo el sistema.
	 * 
	 * @memberOf TypeSubjectRegisterComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private _methodsServices: MethodsServices,
		) {
		this.title = 'Registro de tipo de módulo';
		this.label_input = 'Tipo';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.modelconfiguration = new ModelConfiguration(1,"");
		this.loading = false;
		this.msgError = false;
		this.msgSuccess = false;
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 *
	 * @memberOf TypeSubjectRegisterComponent
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
	 * @description Método que permite volver a la vista de tipos de asignatura.
	 * Redirige a la vista de tipos de asignatura.
	 *
	 * @memberOf TypeSubjectRegisterComponent
	 */
	onBack() {
		this._router.navigate(['/configuration/typessubjects']);
	}

	/**
	 * @method onSubmit
	 * @description Permite registar tipos de asignaturas.
	 * Suscribe al servicio _configurationService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf UserRegisterComponent
	 */
	onSubmit() {
		this.loading = true;
		this._configurationService.typeSubjectRegister(this.modelconfiguration).subscribe(
			(response:any) => {
				this.loading = false;
				if (response.status != 'success') {
					this.msgError = true;
					this.msg = response.msg;
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
