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
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { SKeys } from 'src/app/objets/skey';

/**
 * Componente de control de estudio que permite visualizar las materias asignadas a los facilitadores.
 *
 * @export
 * @class SubjectsFacilitatorComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
    selector: 'subjects-facilitator',
    templateUrl: './subjectfacilitator.html',
    providers: [UserServices, StudycontrolServices]
})

export class SubjectsFacilitatorComponent implements OnInit {

    /**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {User} user - Instacia del objeto User.
     * @type {any} desc_hash - contiene el id del usuario.
     * @type {string} tablebd - Variable utilizada para saber que tabla de la base de datos se gestionara.
	 * @type {any} subjectfacilitator - Almacena las asignaturas relacionadas con el usuario.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf SubjectsFacilitatorComponent
	 */
    public title: string;
    public token: string;
    public identity: string;
    public user: User;
    public desc_hash: any;
    public tablebd: string;
    public subjectfacilitator: any;
    public sKeys: SKeys;

    /**
	 * @description Constructor del componente, en el podemos cargar funcionalidades.
	 * @param {ActivatedRoute} _route Contiene información sobre una ruta asociada y permite gestionar datos de la ruta.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {StudycontrolServices} _studycontrolService Servicios para la gestión de datos de control de estudio.
	 */
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserServices,
        private _studycontrolService: StudycontrolServices,
    ) {
        this.title = 'Módulos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.tablebd = 'Lection-Facilitator';
        this.sKeys = new SKeys();

    }

    /**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Se asigna un arreglo con los roles que puede acceder a la información a la variable firewall.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * De ser positiva la verificación,  asigna un objeto con las opciones de la tabla y luego se subscribe al servico views para acceder a los datos consultados a la API.
	 *
	 * @memberOf SubjectsFacilitatorComponent
	 */
    ngOnInit() {
        if (this.identity == null) {
            this._router.navigate(['/login']);
        } else {
            this._route.params.forEach((params: Params) => {
                var bytes = CryptoJS.AES.decrypt(params['id'], this.sKeys.secretKey);
                this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
                this._studycontrolService.getData(this.desc_hash, this.tablebd).subscribe(
						(response:any) => {
                            this.subjectfacilitator = response.data;
						},
						error => {
							console.log(<any>error)
						}
					);
            });
        }
    }
}
