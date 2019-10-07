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
import { User } from '../../security/users/user';
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
 * Componente de control de estudio que permite visualizar las asignaturas asociadas al usuario.
 *
 * @export
 * @class SubjectsStudentComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'subjects-student',
    templateUrl: './subjectstudent.html',
    providers: [UserServices, StudycontrolServices, MethodsServices]
})

export class SubjectsStudentComponent implements OnInit {

    /**
	 * @type {string} title - Titulo utilizado en la interfaz del sistema.
	 * @type {User} user - Instacia del objeto User.
	 * @type {BsModalRef} modalInscription - Instacia del objeto BsModalRef, permite mostrar ventanas emergenes en el DOM.
	 * @type {BsModalRef} modalDesInscription - Instacia del objeto BsModalRef, permite mostrar ventanas emergenes en el DOM.
	 * @type {string} token - Token de usuario para permisos a funcionalidades y sesión del sistema.
	 * @type {any} identity - Objeto utilizado para almacenar información del usuario logueado.
	 * @type {any} desc_hash - contiene el id del usuario a modificar.
	 * @type {any} id_inscrip - Variable que almacena el id de la inscripción.
	 * @type {string} tablebd - Tabla de la base de datos a gestionar.
	 * @type {any} subjectstudent -Variable que almacena los datos de estudiantes y sus asignaturas.
     * @type {DataTableDirective} dtElement - Almacena la instancia generada.
	 * @type {DataTables} dtOptions - Objeto para pasar las opciones la instancia de la tabla.
	 * @type {Subject} dtTrigger - RXJS.
	 * @type {string} msg - Variable utilizada para devolver mensajes en funciones.
	 * @type {boolean} loading - Variable utilizada para mostrar la imagen de "cargando".
	 * @type {any} msgError - Variable utilizada para mostrar el mensaje de error.
	 * @type {any} msgSuccess -  Variable utilizada para mostrar mensaje de exito.
     * @type {any} cohorts - Variable que almacena las cohortes.
     * @type {any} cohort - Variable que almacena la cohorte a gestionar.
	 * @type {ValidationPatterns} validationsPatterns - Instacia del objeto ValidationPatterns.
	 * @type {SKeys} sKeys - Instacia del objeto SKeys.
	 * @memberOf SubjectsStudentComponent
	 */
    public title: string;
    public user: User;
    public modalInscription: BsModalRef;
    public modalDesInscription: BsModalRef;
    public token: string;
	public identity: any;
    public desc_hash: any;
    public id_inscrip: any;
    public tablebd: string;
    public subjectstudent: any;
    @ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
    public dtTrigger: Subject<SubjectsStudentComponent> = new Subject();
    @ViewChild("templateModelDesInscription") templateModelDesInscription;
    public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public cohorts: any;
    public cohort: any;
    public validationsPatterns: ValidationPatterns;
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
	 * @memberOf SubjectsStudentComponent
	 */
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserServices,
        private _studycontrolService: StudycontrolServices,
        private modalService: BsModalService,
        private _methodsServices: MethodsServices
    ) {
        this.title = 'Inscripciones';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.tablebd = 'Cohort-Student';
        this.validationsPatterns = new ValidationPatterns();
		this.sKeys = new SKeys();

    }

    /**
	 * @method ngOnInit
	 * @description Método que permite ejecutar código de inicialización.
	 * Tiene una estructura de decisión que verifica si el usuario esta logueado y tiene el permiso adecuado para ver la información del componete. De ser invalido, redirecciona al login si no se encuentra logueado y si el usuario no tiene rol administrador redirecciona a la vista del firewall, si el valido obtiene el hash enviado desde la ruta, una vez obtenido el hash es desencriptado para identificar el usuario.
	 * Una vez comprobado que existe el paramentro id, por medio del servicio get_selects se obtiene las cohortes.
     * Se establecen las opciones para la tabla dinamica.
     * Por medio del servicio _studycontrolService se accede a la información solicitada.
	 * 
	 * @memberOf SubjectsStudentComponent
	 */
    ngOnInit() {
        if (this.identity == null) {
            this._router.navigate(['/login']);
        } else {
            this._route.params.forEach((params: Params) => {
                var bytes = CryptoJS.AES.decrypt(params['id'], this.sKeys.secretKey);
                this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
                this._studycontrolService.get_selects('cohorts').subscribe(
					(response: any) => {
						this.cohorts = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
                var secretKey = this.sKeys.secretKey;
                this.dtOptions = {
                    pagingType: 'full_numbers',
                    responsive: true,
                    scrollY:        '40vh',
                    scrollCollapse: true,
                    paging:         false,
                    searching: false,
                    info: false,
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
                        data: 'cohort'
                    }, {
                        data: 'aproved',
                        render: function (data: any, type: any, full: any) {
                            if (data == 'true') {
                                return '<div class="text-success"><b>Aprobada</b></div>';
                            } else {
                                return '<div class="text-danger"><b>Sin aprobar</b></div>';
                            }
                        }
                    }, {
                        data: 'id',
                        orderable:false,
                        searchable:false,
                        render: function (data: any, type: any, full: any) {
                            var ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
                            return '<button type="button" class="btn btn-outline-danger btn-sm" view-id="'+ciphertext+'"><i class="fas fa-trash"></i></button>';
                        }
                    }],
                    rowCallback: (row, data) => {
                        $('td:eq(2) button', row).unbind('click');
                        $('td:eq(2) button', row).bind('click', (event) => {
                            this.openModalDesInscription($('td:eq(2) button', row).attr('view-id'), this.templateModelDesInscription);
                        });
                        return row;
                    }
                };

                this._studycontrolService.getData(this.desc_hash, this.tablebd).subscribe(
                    (response: any) => {
                        this.subjectstudent = response.data;
					    this.dtTrigger.next();
                    },
                    error => {
                        console.log(<any>error)
                    }
                );
            });
        }
    }

    /**
	 * @method openModalDelete
	 * @description Método que permite mostrar la ventana modal de eliminar.
	 * Por medio del TemplateRef podemos acceder a la ventana modal en nuestro template, por medio del servicio modalService y su metodo show mostramos la ventana en pantalla.
	 *
	 * @param {TemplateRef<any>} templateModelInscription refencia a la plantilla contenedora de la ventana modal
	 *
	 * @memberOf SubjectsStudentComponent
	 */
    openModalInscription(templateModelInscription: TemplateRef<any>) {
		this.modalInscription = this.modalService.show(templateModelInscription);
    }

    /**
	 * @method openModalDelete
	 * @description Método que permite mostrar la ventana modal de eliminar.
	 * Por medio del TemplateRef podemos acceder a la ventana modal en nuestro template, por medio del servicio modalService y su metodo show mostramos la ventana en pantalla.
	 *
	 * @param {TemplateRef<any>} templateModelDesInscription refencia a la plantilla contenedora de la ventana modal
	 *
	 * @memberOf SubjectsStudentComponent
	 */
    openModalDesInscription(id, templateModelDesInscription: TemplateRef<any>) {
        var bytes  = CryptoJS.AES.decrypt(id, this.sKeys.secretKey);
		this.modalDesInscription = this.modalService.show(templateModelDesInscription);
        this.id_inscrip = bytes.toString(CryptoJS.enc.Utf8);
    }
    
    /**
	 * @method RefreshTable
	 * @description Método que permite refrescar los elementos de la tabla dinamica.
	 * Se crea una nueva instancia de los elementos en tabla y por medio del servicio _studycontrolService getData se refrescan los datos..
	 *
	 * @memberOf SubjectsStudentComponent
	 */
    RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
            this._studycontrolService.getData(this.desc_hash, this.tablebd).subscribe(
                (response: any) => {
                    this.subjectstudent = response.data;
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
		});
	}

    /**
	 * @method onPreInscription
	 * @description Método que permite pre inscribir un estudiante.
	 * Por medio del servicio _studycontrolService preInscription pasamos la información a la base de datos para que registre el usuario a aspirante del sistema.
	 *
	 * @memberOf SubjectsStudentComponent
	 */
    onPreInscription() {
        this.loading = true;
		this._studycontrolService.preInscription(this.desc_hash,this.cohort).subscribe(
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
                this.modalInscription.hide();
				this.RefreshTable();
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
	 * @method onDesInscription
	 * @description Método que permite pre inscribir un estudiante.
	 * Por medio del servicio _studycontrolService desInscription pasamos la información a la base de datos para que desincriba el usuario de la cohorte.
	 *
	 * @memberOf SubjectsStudentComponent
	 */
    onDesInscription() {
        this.loading = true;
		this._studycontrolService.desInscription(this.id_inscrip).subscribe(
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
                this.modalDesInscription.hide();
				this.RefreshTable();
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
}
