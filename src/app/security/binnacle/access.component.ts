/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Access } from './access';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { BinnacleServices } from '../../services/binnacle.services';
import { DataTableDirective } from 'angular-datatables';
import { OptionsTable } from '../../objets/optionsTable';

/**
 * Componente de seguridad que permite visualizar la bitácora de accesos de usuario realizados en el sistema.
 * 
 * @export
 * @class BinnacleAccessComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'binnacle-access-views',
	templateUrl: 'access.html',
	providers: [BinnacleServices]
})

export class BinnacleAccessComponent implements OnInit {

	/**
	 *
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} access - Instacia de la Access.
	 * @typedef ViewChild DataTableDirective - Selecciona el elemento html que tiene la directiva datatable para crear una instancia de la clase datatablejs.
	 * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {any} optionsTable - Objeto con las opciones de tablas dinamicas para el sistema.
	 * @memberOf BinnacleAccessComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public access: Access[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<BinnacleAccessComponent> = new Subject();
	public optionsTable: any;

	/**
	 * @description Constructor del componente, en el podemos cargar funcionalidades.
	 *
	 * @param _router Permite gestionar el sistema de rutas de angular.
	 * @param _userService Servicios para la gestión de usuarios.
	 * @param _binnacleService Servicio para la gestión de datos de bitácora desde la API.
	 */

	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _binnacleService: BinnacleServices
		){
			this.title = 'Bitácora de accesos';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.optionsTable = new OptionsTable();
		}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * De ser positiva la verificación,  asigna un objeto con las opciones de la tabla y luego se subscribe al servico getAccess para acceder a los datos consultados a la API.
	 *
	 * @memberOf BinnacleAccessComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this.dtOptions = this.optionsTable.options;
			this._binnacleService.getAccess().subscribe(
				(response:any) => {
					this.access = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error);
				}
			);
		}
	}
}

