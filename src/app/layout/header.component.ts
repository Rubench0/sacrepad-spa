/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */
 
import { Component, OnInit } from '@angular/core';
import { UserServices } from '../services/user.services';

/**
 * Componente que tiene como funcionalidad cargar el header del sistema.
 * 
 * @export
 * @class HeaderComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'header-nav',
	templateUrl: 'header.html',
	providers: [UserServices]
})

export class HeaderComponent implements OnInit {

	/**
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 *
	 * @memberOf HeaderComponent
	 */
	public token: string;
	public identity: any;

	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 */
	constructor(
		private _userService: UserServices,
		) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){}
}
