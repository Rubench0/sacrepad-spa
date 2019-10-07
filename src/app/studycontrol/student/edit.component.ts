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
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ValidationPatterns } from 'src/app/objets/validation';
import { SKeys } from 'src/app/objets/skey';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de control de estudio que permite editar los estudiantes.
 *
 * @export
 * @class StudentEditComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'students-edit',
	templateUrl: '../../security/users/edit.html',
	providers: [UserServices,MethodsServices]
})

export class StudentEditComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {User} user - Instacia del objeto User.
	 * @type {BsModalRef} modalDelete - Instacia del objeto BsModalRef, permite mostrar ventanas emergenes en el DOM.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} desc_hash - contiene el id del usuario a modificar.
	 * @type {any} roles - Arreglo que contiene los roles del sistema.
	 * @type {any} roledit - Permite verificar si tiene acceso a editar los roles en vista.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf StudentEditComponent
	 */
	public title: string;
	public user: User;
	public modalDelete: BsModalRef;
	public token: string;
	public identity: any;
	public desc_hash: any;
	public roles: any;
	public roledit: boolean;
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
	 * @param {BsModalService} modalService
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf StudentEditComponent
	 */
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private modalService: BsModalService,
		private _methodsServices: MethodsServices
		){
		this.title = 'Participante';
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
	 * Se asinga un arreglo con los roles que seran cargados en el select de la vista
	 * Una vez comprobado que existe el paramentro id, creamos una instancia del objeto User.
	 * Por medio del servicio getUser se obtiene la información de la tabla a consultar y mustra la información del elemento consultado.
	 * 
	 * @memberOf StudentEditComponent
	 */
	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], this.sKeys.secretKey);
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.roles = [
					{ text: 'Usuario', value: 'ROLE_USER' },
					{ text: 'Administrador', value: 'ROLE_ADMIN' },
					{ text: 'participante', value: 'ROLE_USER_S' },
					{ text: 'Facilitador', value: 'ROLE_USER_F' },
				];
				this.user = new User(1,"","","","","","","","","","","","","",true);
				this._userService.getUser(this.desc_hash).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this._methodsServices.errorAlert().then((res)=>{
								this.msgError = res;
							});
						} else {
							this.user = new User(
								response.data.id,
								response.data.login,
								response.data.password,
								response.data.email,
								response.data.rol,
								response.data.name,
								response.data.surname,
								response.data.phone,
								response.data.identification,
								"",
								response.data.name2,
								response.data.surname2,
								response.data.type,
								"",
								response.data.active
							);
							//console.log(this.user);
							this.roledit = false;
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
			});
		}
	}

	/**
	 * @method openModalDelete
	 * @description Método que permite mostrar la ventana modal de eliminar.
	 * Por medio del TemplateRef podemos acceder a la ventana modal en nuestro template, por medio del servicio modalService y su metodo show mostramos la ventana en pantalla.
	 *
	 * @param {TemplateRef<any>} templateModelDelete refencia a la plantilla contenedora de la ventana modal
	 *
	 * @memberOf StudentEditComponent
	 */
	openModalDelete(templateModelDelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateModelDelete);
	}

	/**
	 * @method onSubmit
	 * @description Permite editar el elemento seleccionado.
	 * Suscribe al servicio _userService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf StudentEditComponent
	 */
	onSubmit() {
		this.loading = true;
		this._userService.updateUser(this.user).subscribe(
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
	 * @description Método que permite volver a la vista de estudiantes.
	 * Redirige a la vista de estudiantes.
	 *
	 * @memberOf StudentEditComponent
	 */
	onBack() {
		this._router.navigate(['/studycontrol/students']);
	}

	/**
	 * @method onDelete
	 * @description Método que permite eliminar un usuario.
	 * Por medio del servicio _userService metodo deleteUser, se elimina un reigstro de la base de datos, pasando su id y su tabla. Una vez recibida la respuesta del servicio, comprueba el estatus, si no es igual a error muestra un mensaje de error, de lo contrario redirecciona a la vist de cohortes.
	 *
	 * @memberOf StudentEditComponent
	 */
	onDelete() {
		this.loading = true;
		this._userService.deleteUser(this.user).subscribe(
			(response:any) => {
				if(response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.msg = response.msg;
					this.modalDelete.hide();
					this.msgSuccess = true;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});
					this._router.navigate(['/studycontrol/students']);
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

	/**
	 * @method activeUser
	 * @description Método que permite activar/desactivar un usuario.
	 * Comprueba el estado actual del usuario y asigna a la variable user.active el resultado.
	 * Por medio del servicio _userService changestatusUser gestionamos el servicio para cambiar el estado.
	 *
	 * @memberOf StudentEditComponent
	 */
	activeUser(status) {
		if (status == true) {
			this.user.active = false;
		} else {
			this.user.active = true;
		}
		this._userService.changestatusUser(this.user.active,this.user.id).subscribe(
			(response:any) => {
				if(response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.loading = false;
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
