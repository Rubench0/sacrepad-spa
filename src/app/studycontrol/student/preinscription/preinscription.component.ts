/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudycontrolServices } from 'src/app/services/studycontrol.services';
import { UserServices } from 'src/app/services/user.services';
import { ValidationPatterns } from 'src/app/objets/validation';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de control de estudio que permite pre-inscribir al usuario.
 *
 * @export
 * @class PreinscriptionComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-preinscription',
  templateUrl: './preinscription.component.html',
  styleUrls: ['./preinscription.component.css'],
  providers: [UserServices, StudycontrolServices, MethodsServices]
})
export class PreinscriptionComponent implements OnInit {

  /**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
   * @type {any} cohorts - Variable que almacena las cohortes.
   * @type {any} cohort - Variable que almacena la cohorte a gestionar.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @memberOf PreinscriptionComponent
	 */
  public title: string;
  public token: string;
	public identity: any;
  public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
  public cohorts: any;
  public cohort: any;
  public validationsPatterns: ValidationPatterns;

  constructor(
    private _router: Router,
    private _userService: UserServices,
    private _studycontrolService: StudycontrolServices,
    private _methodsServices: MethodsServices
  ) {
    this.title = 'Pre-Inscripción del aspirante';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.validationsPatterns = new ValidationPatterns();
  }

  /**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall, si el valido obtiene el hash enviado desde la ruta, una vez obtenido el hash es desencriptado para identificar el usuario.
	 * Se cargar las cohortes en el select por medio del servicio _studycontrolService.
	 * @memberOf PreinscriptionComponent
	 */
  ngOnInit() {
    if (this.identity == null) {
      this._router.navigate(['/login']);
    } else {
      this._studycontrolService.get_selects('cohorts').subscribe(
        (response: any) => {
          this.cohorts = response.data;
        },
        error => {
          console.log(<any>error);
        }
      );
    }
  }

  /**
	 * @method onSubmit
	 * @description Permite registar la preinscripcion.
	 * Suscribe al servicio _studycontrolService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 *
	 * @memberOf PreinscriptionComponent
	 */
  onSubmit() {
    this.loading = true;
    this._studycontrolService.preInscription(this.identity.id,this.cohort).subscribe(
			(response:any) => {
        this.loading = false;
				if (response.status != 'success') {
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
    this._router.navigate(['/studycontrol/cohorts/student']);
  }

}
