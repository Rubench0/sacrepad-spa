import { Component, OnInit, TemplateRef, Renderer, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cohort } from './cohort';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


@Component({
	selector: 'inscriptions',
	templateUrl: 'inscriptions.html',
	providers: [UserServices,StudycontrolServices]
})

export class InscriptionsComponent implements OnInit {
	public title: string;
	public cohort: Cohort;
	public modalRef: BsModalRef;
	public modalDelete: BsModalRef;
	public modalInscriptions: BsModalRef;
	public modalDesInscriptions: BsModalRef;
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
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<InscriptionsComponent> = new Subject();
	public students;
	public _id_cohort;
	public input_search;
	public respon;
	public studentss;
	public _id_student;
	public _inscriptions;
	public _id_student_d;
	@ViewChild("templateUnsubscribe") templateUnsubscribe;
	@ViewChild("templateInscriptions") templateInscriptions;
	@ViewChild("templateDesinscriptions") templateDesinscriptions;
	public requirements;
	public date_initial;
	public date_final;
	public active;
	public _id_inscription_aproved;
	public _cohort_limit;
	public lections;
	public loading;
	public msgError;
	public msgSuccess;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private location: Location,
		private modalService: BsModalService,
		){
			this.title = 'Clase';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.tablebd = 'Cohort';
			this.dtElement;
			this.dtOptions;
			this.dtTrigger;
			this._id_cohort;
			this._id_student;
			this.input_search;
			this.respon;
			this.studentss;
			this._inscriptions = 0;
			this._id_student_d;
			this.date_initial;
			this.date_final;
			this.active;
			this._id_inscription_aproved;
			this._cohort_limit;
			this.lections;
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
		}

	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.cohort = new Cohort(1,"","","","","","","");
				this._studycontrolService.get_selects('requirements').subscribe(
					(response: any) => {
						this.requirements = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if (response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this.errorAlert();
						} else {
							this.date_initial = new Date(response.data.initial.date);
							this.date_final = new Date(response.data.final.date);
							if (response.data.active) {
								this.active = 'Si';
							} else {
								this.active = 'No';
							}
							this.cohort = new Cohort(
								response.data.id,
								this.active,
								this.date_initial,
								this.date_final,
								response.data.year,
								response.data.code,
								response.data.limit,
								response.data.inscriptions,
							);
							this._id_cohort = this.cohort.id;
							this._cohort_limit = this.cohort.id;
							this._inscriptions = this.cohort.inscriptions;

							this._studycontrolService.get_lections(this._id_cohort).subscribe(
								(response:any) => {
									this.lections = response.data;
								},
								error => {
									console.log(<any>error);
								}
							);

							this.dtOptions = {
								pagingType: 'full_numbers',
								responsive: true,
								scrollCollapse: false,
								paging:         false,
								searching: false,
								language: {
									"lengthMenu":     "Mostrar _MENU_ registros",
									"zeroRecords":    "No se encontraron coincidencias",
									"info":           "<b>Pre-inscritos: _TOTAL_</b> ",
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
									data: 'identification'
								}, {
									data: 'name'
								}, {
									data: 'aproved',
									orderable:false,
									searchable:false,
									render: function (data: any, type: any, full: any) {
										if (data != 'true') {
											return '<button type="button" class="btn btn-danger btn-sm" id="'+full.id+'" aproved="'+data+'" ><i class="fas fa-times"></i> Desaprobada</button>';
										} else {
											return '<button type="button" class="btn btn-success btn-sm" id="'+full.id+'" aproved="'+data+'" ><i class="fas fa-check"></i> Aprobada</button>';
										}
									}
								}, {
									data: 'id',
									orderable:false,
									searchable:false,
									render: function (data: any, type: any, full: any) {
										if (full.aproved != 'true') {
											return '<button type="button" class="btn btn-outline-danger btn-sm" send-id="'+data+'" ><i class="fas fa-trash"></i> Retirar</button>';
										} else {
											return '<button type="button" class="btn btn-outline-danger btn-sm" send-id="'+data+'" disabled ><i class="fas fa-trash"></i> Retirar</button>';

										}
									}
								}],
								rowCallback: (row, data) => {
									$('td:eq(2) button', row).unbind('click');
									$('td:eq(2) button', row).bind('click', (event2) => {
										if (event2.target.getAttribute('aproved') != 'true') {
											this.openModalInscription(event2.target.getAttribute('id'), this.templateInscriptions);
										} else {
											this.openModalDesInscription(event2.target.getAttribute('id'), this.templateDesinscriptions);

										}
									});
									$('td:eq(3) button', row).unbind('click');
									$('td:eq(3) button', row).bind('click', (event) => {
										this.openModalUnsubscribe(event.target.getAttribute('send-id'),this.templateUnsubscribe);
									});
									return row;
								}
							};

							this._studycontrolService.viewsDatatableStudentInscription(this._id_cohort).subscribe(
								(response:any) => {
									this.students = response.data;
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
		this._router.navigate(['/studycontrol/inscriptions']);
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this._studycontrolService.viewsDatatableStudentInscription(this._id_cohort).subscribe(
				(response:any) => {
					this.students = response.data;
					this.dtTrigger.next();
				},
				error => {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				}
			);
		});
		this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
			(response:any) => {
				this.date_initial = new Date(response.data.initial.date);
				this.date_final = new Date(response.data.final.date);
				this.cohort = new Cohort(
					response.data.id,
					response.data.active,
					this.date_initial,
					this.date_final,
					response.data.year,
					response.data.code,
					response.data.limit,
					response.data.inscriptions,
				);
				this._inscriptions = this.cohort.inscriptions;
			}
		);
	}

	onSearchStudent() {
		this._id_cohort;
		this._studycontrolService.searchStudent(this.input_search).subscribe(
			(response:any) => {
				if (response.data != null) {
					this.respon = true;
					this.studentss = [response.data];
				} else {
					this.respon = false;
				}
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

	onSaveStudent() {
		this._studycontrolService.InscriptionStudent(this._id_student,this._id_cohort).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
				this.modalRef.hide();
				this.RefreshTable();
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	openModalUnsubscribe(id,templateUnsubscribe: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateUnsubscribe);
		this._id_student_d = id;
	}

	onDeleteUnsubscribe() {
		this.loading = true;
		console.log(this._id_student_d, this._id_cohort);
		this._studycontrolService.deleteUnsubscribe(this._id_student_d,this._id_cohort).subscribe(
			(response:any) => {
				this.status = response.status;
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				} else {
					this.msg = response.msg;
					this.msgSuccess = true;
					setTimeout(() => {
						this.msgSuccess = false;
					}, 5000);
				}
				this.modalDelete.hide();
				this.RefreshTable();
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

	openModalInscription(id_inscription, templateInscriptions: TemplateRef<any>) {
		this.modalInscriptions = this.modalService.show(templateInscriptions);
		this._id_inscription_aproved = id_inscription;
	}
	o
	openModalDesInscription(id_inscription, templateDesinscriptions: TemplateRef<any>) {
		this.modalDesInscriptions = this.modalService.show(templateDesinscriptions);
		this._id_inscription_aproved = id_inscription;
	}

	onAprovedInscription() {
		this.loading = true;
		const selected = this.requirements.filter(c => c.selected);
		this._studycontrolService.aprovedInscription(this._id_inscription_aproved,this._id_cohort,selected).subscribe(
			(response:any) => {
				if (response.aproved == '1') {
					this.modalInscriptions.hide();
				} else {
					this.modalDesInscriptions.hide();
				}
				this.loading = false;
				this.status = response.status;
				if (response.status != 'success') {
					this.msgError = true;
					this.msg = response.msg;
					this.errorAlert();
				} else {
					this.msg = response.msg;
					this.msgSuccess = true;
					setTimeout(() => {
						this.msgSuccess = false;
					}, 5000);
				}
				this.RefreshTable();
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

}
