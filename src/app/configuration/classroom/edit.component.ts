/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClassRoom } from './classroom';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ValidationPatterns } from 'src/app/objets/validation';
import { SKeys } from 'src/app/objets/skey';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de configuración que permite editar las aulas de clases.
 *
 * @export
 * @class ClassRoomEditComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'classroom-edit',
	templateUrl: 'edit.html',
	providers: [UserServices, ConfigurationServices, MethodsServices]
})

export class ClassRoomEditComponent implements OnInit {

	/**
	 *
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} label_input - Variable utilizada para el label de los botones.
	 * @type {ClassRoom} classroom - Instacia del objeto ClassRoom.
	 * @type {BsModalRef} modalDelete - Instacia del objeto BsModalRef, permite mostrar ventanas emergenes en el DOM.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} roles - Arreglo que contiene los roles del sistema.
	 * @type {any} desc_hash - contiene el id del usuario a modificar.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf ClassRoomEditComponent
	 */
	public title: string;
	public label_input: string;
	public classroom: ClassRoom;
	public modalDelete: BsModalRef;
	public token: string;
	public identity: any;
	public roles: any;
	public desc_hash: any;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public validationsPatterns: ValidationPatterns;
	public sKeys: SKeys;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {ActivatedRoute} _route Contiene información sobre una ruta asociada y permite gestionar datos de la ruta.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {ConfigurationServices} _configurationService Servicios para la gestión de datos de configuración.
	 * @param {BsModalService} modalService
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf ClassRoomEditComponent
	 */
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private modalService: BsModalService,
		private _methodsServices: MethodsServices
		){
		this.title = 'Aula';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.loading = false;
		this.msgError = false;
		this.msgSuccess = false;
		this.validationsPatterns = new ValidationPatterns();
		this.sKeys = new SKeys();

	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall, si el valido obtiene el hash enviado desde la ruta, una vez obtenido el hash es desencriptado para identificar el usuario.
	 * Una vez comprobado que existe el paramentro id, creamos una instancia del objeto ClassRoom.
	 * Por medio del servicio _configurationService se obtiene la información de la tabla a consultar y mustra la información del elemento consultado.
	 * 
	 * @memberOf ClassRoomEditComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], this.sKeys.secretKey);
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.classroom = new ClassRoom(1,"","","");
				this._configurationService.getclassRoom(this.desc_hash).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = response.msg;
							this._methodsServices.errorAlert().then((res)=>{
								this.msgError = res;
							});
						} else {
							this.classroom = new ClassRoom(
								response.data.id,
								response.data.edifice,
								response.data.floor,
								response.data.name,
							);
						}
					},
					error => {
						//console.log(<any>error)
						this.loading = false;
						this.msgError = true;
						this.msg = 'Error en el servidor, contacte al administrador.';
						this._methodsServices.errorAlert().then((res)=>{
							this.msgError = res;
						});
					}
				);
			});
		}
	}

	/**
	 * @method onSubmit
	 * @description Permite editar el elemento seleccionado.
	 * Suscribe al servicio _configurationService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf ClassRoomEditComponent
	 */
	onSubmit() {
		this.loading = true;
		this._configurationService.updateclassRoom(this.classroom).subscribe(
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

	/**
	 * @method onBack
	 * @description Método que permite volver a la vista de aulas de clases.
	 * Redirige a la vista de aulas de clases.
	 *
	 * @memberOf ClassRoomEditComponent
	 */

	onBack() {
		this._router.navigate(['/configuration/classrooms']);
	}

	/**
	 * @method openModalDelete
	 * @description Método que permite mostrar la ventana modal de eliminar.
	 * Por medio del TemplateRef podemos acceder a la ventana modal en nuestro template, por medio del servicio modalService y su metodo show mostramos la ventana en pantalla.
	 *
	 * @param {TemplateRef<any>} templateModelDelete refencia a la plantilla contenedora de la ventana modal
	 *
	 * @memberOf ClassRoomEditComponent
	 */
	openModalDelete(templateModelDelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateModelDelete);
	}

	/**
	 * @method onDelete
	 * @description Método que permite eliminar un usuario.
	 * Por medio del servicio _configurationService metodo deleteCohort, se elimina un reigstro de laa basde datos, pasando su id y su tabla. Una vez recibida la respuesta del servicio, comprueba el estatus, si no es igual a error muestra un mensaje de error, de lo contrario redirecciona a la vista de aulas de clases.
	 *
	 * @memberOf ClassRoomEditComponent
	 */
	onDelete() {
		this.loading = true;
		this._configurationService.deleteclassRoom(this.classroom).subscribe(
			(response:any) => {
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.modalDelete.hide();
					this.msg = response.msg;
					this.msgSuccess = true;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});
					this._router.navigate(['/configuration/classrooms']);
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
