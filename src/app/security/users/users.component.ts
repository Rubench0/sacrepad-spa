/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { AfterViewInit, Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { DataTableDirective } from 'angular-datatables';
import * as CryptoJS from 'crypto-js';
import { OptionsTable } from '../../objets/optionsTable';

/**
 * Componente de seguridad que permite visualizar la blos usuarios registrados en el sistema.
 * 
 * @export
 * @class UsersComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
	selector: 'users-views',
	templateUrl: 'users.html',
	providers: [UserServices]
})

export class UsersComponent implements AfterViewInit, OnInit {

	/**
	 * 
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} users - Instacia de la User.
	 * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {any} optionsTable - Objeto con las opciones de tablas dinamicas para el sistema.
	 * @memberOf UsersComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public users: User[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<UsersComponent> = new Subject();
	public optionsTable: any;

	/**
	 * @description Constructor del componente, en el podemos cargar funcionalidades.
	 *
	 * @param _router Permite gestionar el sistema de rutas de angular.
	 * @param _userService Servicios para la gestión de usuarios.
	 * @param renderer Permite utilizar elementos dinamicos que no se encuentras definidos en la plantilla.
	 */

	constructor(
		private _router: Router,
		private _userService: UserServices,
		private renderer: Renderer
		){
			this.title = 'Usuarios';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.optionsTable = new OptionsTable();
		}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * De ser positiva la verificación,  asigna un objeto con las opciones de la tabla y luego se subscribe al servico views para acceder a los datos consultados a la API.
	 *
	 * 
	 * @memberOf UsersComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this.optionsTable.options.columns = [{
				data: 'login'
			}, {
				data: 'email'
			}, {
				data: 'id',
				orderable:false,
				searchable:false,
				render: function (data: any, type: any, full: any) {
					var ciphertext = CryptoJS.AES.encrypt(data, 'secret key 123').toString();
					return '<button type="button" class="btn btn-outline-primary btn-sm" view-user-id="'+ciphertext+'"><i class="fas fa-search"></i> Ver / <i class="fas fa-edit"></i> Editar</button>';
				}
			}];
			this.dtOptions = this.optionsTable.options;

			this._userService.views().subscribe(
				(response:any) => {
					this.users = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);
		}

	}

	/**
	 * @method ngAfterViewInit
	 * @description Método que permite ejecutar script de código una vez pase el OnInit.
	 * Escucha el evento click en el DOM, y si el elemento seleccionado contiene la clase "view-user-id" redirecciona a la vista edición del elemento seleccionado.
	 * 
	 * @memberOf UsersComponent
	 */
	ngAfterViewInit() {
		this.renderer.listenGlobal('document', 'click', (event) => {
			if (event.target.hasAttribute('view-user-id')) {
				this._router.navigate(['/users/edit', event.target.getAttribute('view-user-id')]);
			}
		});
	}
}

