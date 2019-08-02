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
import { User } from './user';
import { UserServices } from '../../services/user.services';
import { MethodsServices } from 'src/app/services/methods.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

/**
 * Componente de seguridad que permite editar usuarios en el sistema.
 * 
 * @export
 * @class UserEditComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'user-edit',
	templateUrl: 'edit.html',
	providers: [UserServices]
})

export class UserEditComponent implements OnInit {

	/**
	 * 
	 * 
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {User} user - Instacia del objeto User.
	 * @type {BsModalRef} modalDelete - Instacia del objeto BsModalRef, permite mostrar ventanas emergenes en el DOM.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} roles - Arreglo que contiene los roles del sistema.
	 * @type {any} desc_hash - contiene el id del usuario a modificar.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @memberOf UserEditComponent
	 */
	public title: string;
	public user: User;
	public modalDelete: BsModalRef;
	public token: string;
	public identity: any;
	public roles: any;
	public desc_hash: any;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {ActivatedRoute} _route Contiene información sobre una ruta asociada y permite gestionar datos de la ruta.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {BsModalService} modalService 
	 * @param {MethodsServices} _methodsService Servicio que contiene métodos reutilizables en todo el sistema.
	 * 
	 * @memberOf UserEditComponent
	 */
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private modalService: BsModalService,
		private _methodsService: MethodsServices
		){
			this.title = 'Usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;

	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall, si el valido obtiene el hash enviado desde la ruta, una vez obtenido el hash es desencriptado para identificar el usuario.
	 * Por meido del servicio getUser obtiene la información del usuario y lo identifica mediante una estrucutra de desición , luego lo almacena en la variable user para ser usado en el html.
	 * 
	 * @memberOf UserEditComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.roles = [
					{text: 'Usuario',value: 'ROLE_USER'},
					{text: 'Administrador',value: 'ROLE_ADMIN'},
					{text: 'participante',value: 'ROLE_USER_S'},
					{text: 'Facilitador',value: 'ROLE_USER_F'},
				];
				this.user = new User(1,"","","","","","","","","","","","","",true);
				this._userService.getUser(this.desc_hash).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this._methodsService.errorAlert().then((res)=>{
								this.msgError = res;
							});
						} else {
							if (response.data.type == '1') {
								this.user = new User(
									response.data.id,
									response.data.login,
									response.data.password,
									response.data.email,
									response.data.rol,
									response.data.name,
									response.data.surname,
									response.data.phone,
									"",
									"",
									"",
									"",
									response.data.type,
									"",
									response.data.active
								);
							} else if (response.data.type == '2') {
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
									response.data.profession,
									"",
									"",
									response.data.type,
									"",
									response.data.active
								);
							} else if (response.data.type == '3') {
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
							}
						}
					},
					error => {
						//console.log(<any>error)
						this.loading = false;
						this.msgError = true;
						this.msg = 'Error en el servidor, contacte al administrador.';
						this._methodsService.errorAlert().then((res)=>{
							this.msgError = res;
						});
					}
				);
			});
		}
	}

	/**
	 * @method onSubmit
	 * @description Permite editar usuario.
	 * Suscribe al servicio _userService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf UserEditComponent
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
				//console.log(<any>error)
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsService.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
	}

	/**
	 * @method onBack
	 * @description Método que permite volver a la vista de usuarios.
	 * Redirige a la vista de usuairos.
	 * 
	 * @memberOf UserEditComponent
	 */
	onBack() {
		this._router.navigate(['/users']);
	}

	/**
	 * @method onDelete
	 * @description Método que permite eliminar un usuario.
	 * Por medio del servicio _userService metodo deleteUser, se eliminar un usuario de la basde datos. Una vez recibida la respuesta del servicio, comprueba el estatus, si no es igual a error muestra un mensaje de error, de lo contrario redirecciona a la tabla de usuarios.
	 * 
	 * @memberOf UserEditComponent
	 */
	onDelete() {
		this.loading = true;
		this._userService.deleteUser(this.user).subscribe(
			(response:any) => {
				if(response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this._methodsService.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this._router.navigate(['/users']);
				}
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsService.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
	}

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
					this._methodsService.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.loading = false;
					this.msg = response.msg;
					this.msgSuccess = true;
					this._methodsService.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});
				}
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsService.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
	}

	openModalDelete(templateModelDelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateModelDelete);
	}
}
