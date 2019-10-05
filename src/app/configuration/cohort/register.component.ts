/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cohort } from './cohort';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import { MethodsServices } from '../../services/methods.services';
import { BsDatepickerConfig,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ValidationPatterns } from 'src/app/objets/validation';
defineLocale('es', esLocale);

/**
 * Componente de configuración que permite registrar cohortes.
 *
 * @export
 * @class CohortRegisterComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'cohort-register',
	templateUrl: 'register.html',
	providers: [UserServices,ConfigurationServices,MethodsServices]
})

export class CohortRegisterComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {Cohort} cohort - Instacia del objeto Cohort.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @memberOf CohortRegisterComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public cohort: Cohort;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public validationsPatterns: ValidationPatterns;
	bsConfig: Partial<BsDatepickerConfig>;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {ConfigurationServices} _configurationService Servicios para la gestión de datos de configuración.
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 * @param {BsLocaleService} localeService Permite establecer el idioma en el que se formatea la hora.
	 *
	 * @memberOf CohortRegisterComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		public _methodsServices: MethodsServices,
		private localeService: BsLocaleService
		) {
		this.title = 'Registro de cohorte';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.cohort = new Cohort(1,"","","","","","");
		this.loading = false;
		this.msgError = false;
		this.msgSuccess = false;
		this.validationsPatterns = new ValidationPatterns();
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * se le asigna a la variable bsConfig la configuración general para el formato de las fechas.
	 *
	 * @memberOf CohortRegisterComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue',  dateInputFormat: 'DD-MM-YYYY' });
			this.localeService.use('es');
		}
	}

	/**
	 * @method onSubmit
	 * @description Permite registar tipos de asignaturas.
	 * Suscribe al servicio _configurationService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf CohortRegisterComponent
	 */
	onSubmit() {
		this.loading = true;
		this._configurationService.cohortRegister(this.cohort).subscribe(
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
