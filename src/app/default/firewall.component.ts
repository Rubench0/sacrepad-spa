/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../services/user.services';

/**
 * Componente para mostrar el pantalla de firewall.
 *
 * @export
 * @class FirewallComponent
 * @implements {OnInit}
 */

@Component({
	selector: 'firewall',
	templateUrl: 'firewall.html',
	providers: [UserServices]
})

export class FirewallComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 */

	public token;
	public identity;

	/**
	 * @description Constructor del componente, en el podemos cargar funcionalidades.
	 *
	 * @param _router Permite gestionar el sistema de rutas de angular.
	 * @param _userService Servicios para la gestión de usuarios.
	 */
	constructor(
		private _router: Router,
		private _userService: UserServices
		){
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}
	
	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 *
	 * @memberOf FirewallComponent
	 */
	ngOnInit(){
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
		}
	}
}
