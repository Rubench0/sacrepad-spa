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
import { User } from '../../security/users/user';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { DataTableDirective } from 'angular-datatables';
import * as CryptoJS from 'crypto-js';
import { SKeys } from 'src/app/objets/skey';
import { OptionsTable } from 'src/app/objets/optionsTable';

/**
 * Componente de control de estudio que permite visualizar los participantes.
 *
 * @export
 * @class StudentsComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
	selector: 'students-views',
	templateUrl: 'students.html',
	providers: [UserServices]
})

export class StudentsComponent implements AfterViewInit, OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {User} students - Instacia del objeto User.
	 * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {any} optionsTable - Objeto con las opciones de tablas dinamicas para el sistema.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf StudentsComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public students: User[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<StudentsComponent> = new Subject();
	public optionsTable: any;
	public sKeys: SKeys;

	/**
	 * @description Constructor del componente, en el podemos cargar funcionalidades.
	 *
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {Renderer} renderer Permite utilizar elementos dinamicos que no se encuentras definidos en la plantilla.
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices,
		private renderer: Renderer
		){
		this.title = 'Participantes';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.optionsTable = new OptionsTable();
		this.sKeys = new SKeys();
	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Se asigna un arreglo con los roles que puede acceder a la información a la variable firewall.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * De ser positiva la verificación,  asigna un objeto con las opciones de la tabla y luego se subscribe al servico views para acceder a los datos consultados a la API.
	 *
	 * @memberOf StudentsComponent
	 */
	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {
			var secretKey = this.sKeys.secretKey;
			this.optionsTable.options.columns = [{
				data: 'name'
			}, {
				data: 'surname'
			}, {
				data: 'identification'
			}, {
				data: 'id',
				orderable:false,
				searchable:false,
				render: function (data: any, type: any, full: any) {
					var ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
					return '<button type="button" class="btn btn-outline-primary btn-sm" view-id="'+ciphertext+'"><i class="fas fa-search"></i> Ver / <i class="fas fa-edit"></i> Editar</button>';
				}
			}];
			this.dtOptions = this.optionsTable.options;
			this._userService.viewsStudents().subscribe(
				(response:any) => {
					//console.log(response.data);
					this.students = response.data;
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
	 * @memberOf StudentsComponent
	 */
	ngAfterViewInit() {
		this.renderer.listenGlobal('document', 'click', (event) => {
			if (event.target.hasAttribute('view-id')) {
				this._router.navigate(['/studycontrol/student/edit', event.target.getAttribute('view-id')]);
			}
		});
	}
}

