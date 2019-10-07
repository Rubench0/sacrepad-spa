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
import { Subject } from './subject';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import { ValidationPatterns } from 'src/app/objets/validation';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de configuración que permite registrar las asignaturas.
 *
 * @export
 * @class SubjectRegisterComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'subject-register',
	templateUrl: 'register.html',
	providers: [UserServices,StudycontrolServices,MethodsServices]
})

export class SubjectRegisterComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {Subject} subject - Instacia del objeto Subject.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {any} types -  Variable utilizada para almacenar los tipos de asignatura.
	 * @type {any} cohorts -  Variable utilizada para almacenar las cohortes.
	 * @type {any} clasifications -  Variable utilizada para almacenar las clasificaciones de asignatura.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @memberOf SubjectRegisterComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public subject: Subject;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public types: any;
	public cohorts: any;
	public clasifications: any;
	public validationsPatterns: ValidationPatterns;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {StudycontrolServices} _studycontrolService Servicios para la gestión de datos de control de estudio.
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf SubjectRegisterComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		public _methodsServices: MethodsServices,
		) {
		this.title = 'Registro de módulo';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.subject = new Subject(1,"","","","");
		this.loading = false;
		this.msgError = false;
		this.msgSuccess = false;
		this.validationsPatterns = new ValidationPatterns();
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * Por medio del servicio _studycontrolService y el metodo get_selects asignamos las clasifiaciones y tipos a los select en vista.
	 *
	 * @memberOf SubjectRegisterComponent
	 */
	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {
			this._studycontrolService.get_selects('clasifications').subscribe(
				(response:any) => {
					this.clasifications = response.data;
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error al cargar clasificaciones, recargue la página.';
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				}
			);
			this._studycontrolService.get_selects('types').subscribe(
				(response:any) => {
					this.types = response.data;
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error al cargar tipos, recargue la página.';
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				}
			);
		}
	}

	/**
	 * @method onBack
	 * @description Método que permite volver a la vista de asignaturas.
	 * Redirige a la vista de asignaturas.
	 *
	 * @memberOf SubjectRegisterComponent
	 */
	onBack() {
		this._router.navigate(['/studycontrol/subjects']);
	}

	/**
	 * @method onSubmit
	 * @description Permite registar tipos de asignaturas.
	 * Suscribe al servicio _configurationService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf SubjectRegisterComponent
	 */
	onSubmit() {
		this.loading = true;
		this._studycontrolService.subjectRegister(this.subject).subscribe(
			(response:any) => {
				this.loading = false;
				if (response.status != 'success') {
					this.loading = false;
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