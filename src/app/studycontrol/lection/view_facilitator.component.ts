/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Lection } from './lection';
import { Qualification } from './qualification';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ValidationPatterns } from 'src/app/objets/validation';
import { SKeys } from 'src/app/objets/skey';
import { MethodsServices } from 'src/app/services/methods.services';

/**
 * Componente de control de estudio que permite visualizar una cohorte como facilitador.
 *
 * @export
 * @class SubjectViewFacilitatorComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
	selector: 'lection-view-facilitator',
	templateUrl: 'view_facilitator.html',
	providers: [UserServices,StudycontrolServices,MethodsServices]
})

export class SubjectViewFacilitatorComponent implements OnInit {

	/**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} desc_hash - contiene el id de la cohorte a visualizar.
	 * @type {Lection} lection - Instacia del objeto Lection.
	 * @type {Qualification} qualification - Instacia del objeto Qualification.
	 * @type {BsModalRef} modalqualification - Instacia del objeto BsModalRef, permite mostrar ventanas emergenes en el DOM.
	 * @type {string} tablebd - Variable que se le asigna la tabla a gestionar.
	 * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {any} _id_class - Variable que contiene el id de la lection.
	 * @type {any} inscriptions - Almacena los inscritos en el cohorte visualizado.
	 * @type {any} _cohort - Variable utilizada para almacenar la cohorte.
	 * @type {any} _id_inscription - Se asigna el id de la asigantura dentro de la modal.
	 * @type {any} days_class - Se asigna los horarios de las asignaturas.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @type {any} optionsTable - Objeto con las opciones de tablas dinamicas para el sistema.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	public title: string;
	public token: string;
	public identity: any;
	public desc_hash: any;
	public lection: Lection;
	public qualification: Qualification;
	public modalqualification: BsModalRef;
	public tablebd: string;
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<SubjectViewFacilitatorComponent> = new Subject();
	@ViewChild("templatequalification") templatequalification;
	public _id_class: any;
	public inscriptions: any;
	public _cohort: any;
	public _id_inscription: string;
	public days_class;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public validationsPatterns: ValidationPatterns;
	public optionsTable: any;
	public sKeys: SKeys;


	/**
	 * @description Constructor del componente, cargamos funcionalidades iniciales.
	 * @param {ActivatedRoute} _route Contiene información sobre una ruta asociada y permite gestionar datos de la ruta.
	 * @param {Router} _router Permite gestionar el sistema de rutas de angular.
	 * @param {UserServices} _userService Servicios para la gestión de usuarios.
	 * @param {StudycontrolServices} _studycontrolService Servicios para la gestión de datos de control de estudio.
	 * @param {BsModalService} modalService
	 * @param {MethodsServices} _methodsServices Servicio que contiene métodos reutilizables en todo el sistema.
	 *
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private modalService: BsModalService,
		private _methodsServices: MethodsServices
		){
		this.title = 'Clase';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.tablebd = 'Lection';
		this.dtElement;
		this.dtOptions;
		this.dtTrigger;
		this._id_class;
		this.inscriptions;
		this._cohort;
		this._id_inscription;
		this.loading = false;
		this.msgError = false;
		this.msgSuccess = false;
		this.validationsPatterns = new ValidationPatterns();
		this.sKeys = new SKeys();

	}

	/**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Se asigna un arreglo con los roles que puede acceder a la información a la variable firewall.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall.
	 * Una vez comprobado que existe el paramentro id, creamos una instancia del objeto Lection.
	 * Por medio del servicio _studycontrolService getData solicitamos información a nuestra base de datos y la asignamos al obejto Lection. También asignamos datos de la Lection en las variables globales.
	 * Creamos una instancia del objeto Qualification en 0.
	 * Se asigna un objeto con las opciones de la tabla y luego se subscribe al servico views para acceder a los datos consultados a la API.
	 *
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER_F'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.lection = new Lection(1,"","","","","",0,{});
				this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if (response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this._methodsServices.errorAlert().then((res)=>{
								this.msgError = res;
							});
						} else {
							this.lection = new Lection(
								response.data.id,
								response.data.code,
								response.data.subject.name,
								response.data.classroom.name,
								response.data.cohort,
								response.data.facilitator.name,
								response.data.inscriptions,
								response.data.days,
							);
							this._id_class = this.lection.id;
							this.inscriptions = this.lection.inscriptions;
							this.days_class = this.lection.days;
							this._cohort = this.lection.cohort;
							this.qualification = new Qualification(0);
							this.dtOptions = {
								pagingType: 'full_numbers',
								responsive: true,
								scrollCollapse: false,
								paging:         false,
								searching: false,
								language: {
									"lengthMenu":     "Mostrar _MENU_ registros",
									"zeroRecords":    "No se encontraron coincidencias",
									"info":           "<b>Total de inscritos: _TOTAL_</b> ",
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
									data: 'identification'
								}, {
									data: 'qualification',
									orderable:false,
									searchable:false,
									render: function (data: any, type: any, full: any) {
										if (data >= 10) {
											return '<p class="text-center text-success"><b>'+data+'</b></p>';
										} else if (data < 10) {
											return '<p class="text-center text-danger"><b>'+data+'</b></p>';
										} else {
											return data;
										}
									}
								}, {
									data: 'id',
									orderable:false,
									searchable:false,
									render: function (data: any, type: any, full: any) {
										if (full.qualification != 'N/A') {
											return '<button type="button" class="btn btn-outline-primary btn-sm" send-id="'+data+'" send-qualification="'+full.qualification+'" ><i class="fas fa-sync-alt"></i> Cambiar</button>';
										} else {
											return '<button type="button" class="btn btn-outline-warning btn-sm"  send-id="'+data+'" ><i class="fas fa-share-square"></i> Aprobar</button>';

										}
									}
								}],
								rowCallback: (row: Node, data: any[] | Object, index: 2) => {
									$('button', row).unbind('click');
									$('button', row).bind('click', (event) => {
										if (event.target.getAttribute('send-qualification')) {
											this.qualification = new Qualification(parseInt(event.target.getAttribute('send-qualification')));
										} else {
											this.qualification = new Qualification(0);
										}
										this.openModalQualification(event.target.getAttribute('send-id'),this.templatequalification);
									});
									return row;
								}
							};

							this._studycontrolService.viewsDatatableStudentInscription(this._cohort.id).subscribe(
								(response:any) => {
									this.inscriptions = response.data;
									this.dtTrigger.next();
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
			});
		}
	}

	/**
	 * @method onBack
	 * @description Método que permite volver a la vista de cohortes.
	 * Redirige a la vista de cohortes.
	 *
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	onBack() {
		this._router.navigate(['/studycontrol/lections']);
	}

	/**
	 * @method openModalQualification
	 * @description Método que permite mostrar la ventana modal de eliminar.
	 * Por medio del TemplateRef podemos acceder a la ventana modal en nuestro template, por medio del servicio modalService y su metodo show mostramos la ventana en pantalla.
	 * Asigna el id de la inscripción a la variable _id_inscription.
	 *
	 * @param {string} id trae el id de la inscripción a modificar
	 * @param {TemplateRef<any>} templatequalification refencia a la plantilla contenedora de la ventana modal
	 *
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	openModalQualification(id,templatequalification: TemplateRef<any>) {
		this.modalqualification = this.modalService.show(templatequalification);
		this._id_inscription = id;
	}

	/**
	 * @method RefreshTable
	 * @description Método que permite refrescar los elementos de la tabla dinamica.
	 * Se crea una nueva instancia de los elementos en tabla y por medio del servicio _studycontrolService getData se refrescan los datos en tabla.
	 *
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this._studycontrolService.viewsDatatableStudentInscription(this._cohort.id).subscribe(
				(response:any) => {
					this.inscriptions = response.data;
					this.dtTrigger.next();
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				}
			);
		});
	}

	/**
	 * @method onSaveQuialification
	 * @description Permite editar la calificación seleccionada en la ventana modal.
	 * Suscribe al servicio _studycontrolService para pasar los datos tomados del formulario a la API, una vez conectado espera la respuesta y de ser exitosa muestra mensaje al usuario y refresca la tabla.
	 * De no ser exitoso genera un error el cual se muestra en pantalla.
	 * Por último ocultamos la ventana modal.
	 *
	 * @memberOf SubjectViewFacilitatorComponent
	 */
	onSaveQuialification() {
		this.loading = true;
		this._studycontrolService.QualitificationRegister(this.qualification,this._id_inscription,this._id_class).subscribe(
			(response:any) => {
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.loading = false;
					this.msg = response.msg;
					this.msgSuccess = true;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});
				}
				this.RefreshTable();
			},
			error => {
				//console.log(<any>error);
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsServices.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
		this.modalqualification.hide();
	}
}
