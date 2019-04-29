import { Component, OnInit, TemplateRef, Renderer, ViewChild  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Lection } from './lection';
import { Qualification } from './qualification';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
	selector: 'lection-view-facilitator',
	templateUrl: 'view_facilitator.html',
	providers: [UserServices,StudycontrolServices]
})

export class SubjectViewFacilitatorComponent implements OnInit {
	public title: string;
	public lection: Lection;
	public qualification: Qualification;
	public modalqualification: BsModalRef;
	public status;
	public msg;
	public token;
	public tablebd;
	public hash;
	public desc_hash;
	public identity;
	public subjects;
	public classrooms;
	public facilitators;
	public days;
	public marked;
	public days_class;
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<SubjectViewFacilitatorComponent> = new Subject();
	@ViewChild("templatequalification") templatequalification;
	public _id_class;
	public inscriptions;
	public _cohort;
	public _id_inscription;
	public loading;
	public msgError;
	public msgSuccess;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private location: Location,
		private modalService: BsModalService
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

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.lection = new Lection(1,"","","","","",0,{});
				this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if (response.status != 'success') {
							this.status = 'error';
							console.log(this.status);
						} else {
							this.lection = new Lection(
								response.data.id,
								response.data.code,
								response.data.subject.name,
								response.data.classroom.name,
								response.data.subject.cohort,
								response.data.facilitator.name,
								response.data.inscriptions,
								response.data.days,
							);
							this._id_class = this.lection.id;
							this.days_class = this.lection.days;
							this.inscriptions = this.lection.inscriptions;
							this._cohort = this.lection.cohort.id;
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

							this._studycontrolService.viewsDatatableStudentInscription(this._cohort).subscribe(
								(response:any) => {
									this.inscriptions = response.data;
									this.dtTrigger.next();
								},
								error => {
									this.loading = false;
									this.msgError = true;
									this.msg = 'Error en el servidor, contacte al administrador.';
									this.errorAlert();
								}
							);
						}
					},
					error => {
						this.loading = false;
						this.msgError = true;
						this.msg = 'Error en el servidor, contacte al administrador.';
						this.errorAlert();
					}
				);
			});
		}
	}

	onBack() {
		this._router.navigate(['/studycontrol/lections']);
	}

	openModalQualification(id,templatequalification: TemplateRef<any>) {
		this.modalqualification = this.modalService.show(templatequalification);
		this._id_inscription = id;
	}

	RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this._studycontrolService.viewsDatatableStudentInscription(this._cohort).subscribe(
				(response:any) => {
					this.inscriptions = response.data;
					this.dtTrigger.next();
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				}
			);
		});
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onSaveQuialification() {
		this.loading = true;
		this._studycontrolService.QualitificationRegister(this.qualification,this._id_inscription,this._id_class).subscribe(
			(response:any) => {
				this.status = response.status;
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this.errorAlert();
				} else {
					this.loading = false;
					this.msg = response.msg;
					this.msgSuccess = true;
					setTimeout(() => {
						this.msgSuccess = false;
					}, 5000);
				}
				this.RefreshTable();
			},
			error => {
				//console.log(<any>error);
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
		this.modalqualification.hide();
	}
}
