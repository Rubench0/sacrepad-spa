/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { AfterViewInit, Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { ModelConfiguration } from '../model-configuration';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import { DataTableDirective } from 'angular-datatables';
import * as CryptoJS from 'crypto-js';
import { OptionsTable } from 'src/app/objets/optionsTable';
import { SKeys } from 'src/app/objets/skey';

/**
 * Componente de configuración que permite visualizar los tipos de asignatura.
 *
 * @export
 * @class TypeSubjectComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
	selector: 'typessubject-views',
	templateUrl: '../modelconfiguration.html',
	providers: [UserServices,ConfigurationServices]
})

export class TypeSubjectComponent implements AfterViewInit, OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} label_input - Variable utilizada para el label de los botones.
	 * @type {string} url_register - Determina la ruta utilizada en el servicio registro.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {ModelConfiguration} modelconfiguration - Instacia del objeto ModelConfiguration.
	 * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {any} optionsTable - Objeto con las opciones de tablas dinamicas para el sistema.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf TypeSubjectComponent
	 */
	public title: string;
	public label_input: string;
	public url_register: string;
	public token: string;
	public identity: any;
	public modelconfiguration: ModelConfiguration[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<TypeSubjectComponent> = new Subject();
	public optionsTable: any;
	public sKeys: SKeys;

	/**
	 * @description Constructor del componente, en el podemos cargar funcionalidades.
	 *
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {ConfigurationServices} _configurationService Servicios para la gestión de datos de configuración.
	 * @param {Renderer} renderer Permite utilizar elementos dinamicos que no se encuentras definidos en la plantilla.
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private renderer: Renderer,
		){
		this.title = 'Tipos de módulo';
		this.label_input = 'Tipo';
		this.url_register = '/configuration/typessubject/new';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.optionsTable = new OptionsTable();
		this.sKeys = new SKeys();
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * De ser positiva la verificación,  asigna un objeto con las opciones de la tabla y luego se subscribe al servico views para acceder a los datos consultados a la API.
	 *
	 * @memberOf TypeSubjectComponent
	 */
	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this.dtOptions = {
				pagingType: 'full_numbers',
				responsive: true,
				scrollY:        '40vh',
				scrollCollapse: true,
				paging:         true,
				language: {
					"lengthMenu":     "Mostrar _MENU_ registros",
					"zeroRecords":    "No se encontraron coincidencias",
					"info":           "<b>Total de registros: _TOTAL_</b> ",
					"infoEmpty":      "0 de un total de 0 registros",
					"infoFiltered":   "(filtrado de _MAX_ registros)",
					"paginate": {
						"first":    "<i class='fas fa-less-than-equal'></i>",
						"last":     "<i class='fas fa-greater-than-equal'></i>",
						"next":     "<i class='fas fa-greater-than'></i>",
						"previous": "<i class='fas fa-less-than'></i>"
					},
					"processing":     "<b>Procesando...</b>",
					"emptyTable":     "Ningún dato disponible en esta tabla",
					"search":         "<b>Buscar:</b>",
					"loadingRecords": "Cargando...",
				},
				columns: [{
					data: 'name'
				}, {
					data: 'id',
					orderable:false,
					searchable:false,
					render: function (data: any, type: any, full: any) {
						var ciphertext = CryptoJS.AES.encrypt(data, this.sKeys.secretKey).toString();
						return '<button type="button" class="btn btn-outline-primary btn-sm" view-id="'+ciphertext+'" ><i class="fas fa-edit"></i> Editar</button>';
					}
				}],
			};

			this._configurationService.viewstypeSubject().subscribe(
				(response:any) => {
					//console.log(response.data);
					this.modelconfiguration = response.data;
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
	 * Escucha el evento click en el DOM, y si el elemento seleccionado contiene la clase "view-id" redirecciona a la vista edición del elemento seleccionado.
	 * 
	 * @memberOf TypeSubjectComponent
	 */
	ngAfterViewInit() {
		this.renderer.listenGlobal('document', 'click', (event) => {
			if (event.target.hasAttribute('view-id')) {
				this._router.navigate(['configuration/typessubject/edit', event.target.getAttribute('view-id')]);
			}
		});
	}


}

