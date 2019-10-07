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
import { StudycontrolServices } from '../../services/studycontrol.services';
import { ValidationPatterns } from '../../objets/validation';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de configuración que permite registrar participantes.
 *
 * @export
 * @class StudentRegisterComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'student-register',
	templateUrl: 'register.html',
	providers: [UserServices,StudycontrolServices,MethodsServices]
})

export class StudentRegisterComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {User} student - Instacia del objeto User.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {any} cohorts -  Variable utilizada para almacenar las cohortes.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @memberOf StudentRegisterComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public student: User;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public cohorts: any;
	public validationsPatterns: ValidationPatterns;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {StudycontrolServicesz} _studycontrolService Servicios para la gestión de datos de control de estudio.
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf StudentRegisterComponent
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		public _methodsServices: MethodsServices,
		){
		this.title = 'Pre-Inscripción del aspirante';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.student = new User(1,'',"","","","","","","","","","","3","",true);
		this.loading = false;
		this.msgError = false;
		this.cohorts;
		this.validationsPatterns = new ValidationPatterns();
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Por medio del servicio _studycontrolService y el metodo get_selects_not_auth asignamos los cohortes a los select en vista.
	 *
	 * @memberOf StudentRegisterComponent
	 */
	ngOnInit() {
		// if (this.identity == null) {
		// 	this._router.navigate(['/login']);
		// } else {
		// 	//console.log('Componente register cargado con exito');
		// }
		this._studycontrolService.get_selects_not_auth('cohorts').subscribe(
			(response:any) => {
				this.cohorts = response.data;
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	/**
	 * @method onBack
	 * @description Método que permite volver a la vista de participantes.
	 * Redirige a la vista de participantes.
	 *
	 * @memberOf StudentRegisterComponent
	 */
	onBack() {
		this._router.navigate(['/studycontrol/students']);
	}

	/**
	 * @method onLoginBack
	 * @description Método que permite volver a la vista del login.
	 * Redirige a la vista del login.
	 *
	 * @memberOf StudentRegisterComponent
	 */
	onLoginBack() {
		this._router.navigate(['/login']);
	}

	/**
	 * @method onSubmit
	 * @description Permite registar los estudiantes.
	 * Suscribe al servicio _userService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf StudentRegisterComponent
	 */
	onSubmit() {
		this.loading = true;
		this._userService.InscriptionUser(this.student).subscribe(
			(response:any) => {
				this.loading = false;
				if(response.status != 'success') {
					this.msgError = true;
					this.msg = response.msg;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.msgSuccess = true;
					this.msg = response.msg;
					if (this.identity != null) {
						setTimeout(() => {
							this._router.navigate(['/studycontrol/students']);
						},5000);
					} else {
						setTimeout(() => {
							this._router.navigate(['/login']);
						},5000);
					}
				}
			},
			error => {
				//console.log(<any>error);
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador';
				this._methodsServices.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
	}
}
