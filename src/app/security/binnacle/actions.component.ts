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
import { Actions } from './actions';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { BinnacleServices } from '../../services/binnacle.services';
import { DataTableDirective } from 'angular-datatables';
import { OptionsTable } from '../../objets/optionsTable';

/**
 * Componente de seguridad que permite visualizar la bitácora de acciones realizadas en el sistema.
 *
 * @export
 * @class BinnacleActionComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'binnacle-actions-views',
	templateUrl: 'actions.html',
	providers: [BinnacleServices]
})

export class BinnacleActionComponent implements OnInit {

	/**
	 * 
 	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} actions - Instacia de la Actions.
	 * @typedef ViewChild DataTableDirective - Selecciona el elemento html que tiene la directiva datatable para crear una instancia de la clase datatablejs.
	 * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {any} optionsTable - Objeto con las opciones de tablas dinamicas para el sistema.
	 * @memberOf BinnacleActionComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public actions: Actions[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<BinnacleActionComponent> = new Subject();
	public optionsTable: any;

	/**
	 * @description Constructor del componente en donde inicializamos variables.
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
			this.title = 'Bitácora de acciones';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.optionsTable = new OptionsTable();
		}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * De ser positiva la verificación,  asigna un objeto con las opciones de la tabla y luego se subscribe al servico getActions para acceder a los datos consultados a la API.
	 *
	 * @memberOf BinnacleActionComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this.dtOptions = this.optionsTable.options;
			this._binnacleService.getActions().subscribe(
				(response:any) => {
					this.actions = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);
		}
	}
}