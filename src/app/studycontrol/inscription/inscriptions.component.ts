import { Component, OnInit, TemplateRef, Renderer, ViewChild  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Lection } from '../lection/lection';
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
	public lection: Lection;
	public modalRef: BsModalRef;
	public modalDelete: BsModalRef;
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
	public _id_class;
	public input_search;
	public respon;
	public studentss;
	public _id_student;
	public _inscriptions;
	public _id_student_d;
	@ViewChild("templateUnsubscribe") templateUnsubscribe;
	public requirements;

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
			this._id_student;
			this.input_search;
			this.respon;
			this.studentss;
			this._inscriptions;
			this._id_student_d;
			this.requirements;

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.lection = new Lection(1,"","","","",0,{});
				this._studycontrolService.get_selects('subjects').subscribe(
					(response:any) => {
						this.subjects = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.get_selects('classrooms').subscribe(
					(response:any) => {
						this.classrooms = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.get_selects('facilitators').subscribe(
					(response:any) => {
						this.facilitators = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.get_selects('days').subscribe(
					(response:any) => {
						this.days = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.get_selects('requirements').subscribe(
					(response:any) => {
						this.requirements = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				//console.log(this.requirements);//falta requerimiento
				this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if (response.status != 'success') {
							this.status = 'error';
							console.log(this.status);
						} else {
							this.lection = new Lection(
								response.data.id,
								response.data.code,
								response.data.subject,
								response.data.classroom,
								response.data.facilitator,
								response.data.inscriptions,
								response.data.days,
							);
							this._id_class = this.lection.id;
							this._inscriptions = this.lection.inscriptions;

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
											return '<button type="button" class="btn btn-danger btn-sm" id="'+full.id+'" ><i class="fas fa-times"></i> Desaprobado</button>';
										} else {
											return '<button type="button" class="btn btn-success btn-sm" id="'+full.id+'" ><i class="fas fa-check"></i> Aprobado</button>'
										}
									}
								}, {
									data: 'id',
									orderable:false, 
									searchable:false,
									render: function (data: any, type: any, full: any) {
										return '<button type="button" class="btn btn-outline-danger btn-sm" send-id="'+data+'" ><i class="fas fa-trash"></i> Retirar</button>';
									}
								}],
								rowCallback: (row, data) => {
									$('td:eq(2) button', row).unbind('click');
									$('td:eq(2) button', row).bind('click', (event2) => {
										this.aprovedInscription(event2.target.getAttribute('id'));
									});
									$('td:eq(3) button', row).unbind('click');
									$('td:eq(3) button', row).bind('click', (event) => {
										this.openModalUnsubscribe(event.target.getAttribute('send-id'),this.templateUnsubscribe);
									});
									return row;
								}
							};

							this._studycontrolService.viewsDatatableStudentInscription(this._id_class).subscribe(
								(response:any) => {
									this.students = response.data;
									this.dtTrigger.next();
								},
								error => {
									console.log(<any>error)
								}
							);
						}
					},
					error => {
						console.log(<any>error)
					}
				);			
			});
		}
	}

	onBack() {
		this.location.back();
	}

	RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this._studycontrolService.viewsDatatableStudentInscription(this._id_class).subscribe(
				(response:any) => {
					this.students = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);
		});
		this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
			(response:any) => {
				this.lection = new Lection(
					response.data.id,
					response.data.code,
					response.data.subject,
					response.data.classroom,
					response.data.facilitator,
					response.data.inscriptions,
					response.data.days,
				);
				this._inscriptions = this.lection.inscriptions;
			}
		);
	}

	

	onSearchStudent() {
		this._id_class;
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
				console.log(<any>error)
			}
		);
	}

	onSaveStudent() {
		this._studycontrolService.InscriptionStudent(this._id_student,this._id_class).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
				this.modalRef.hide();
				this.RefreshTable();
			},
			error => {
				console.log(<any>error);
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
		this._studycontrolService.deleteUnsubscribe(this._id_student_d,this._id_class).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
				this.modalDelete.hide();
				this.RefreshTable();
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	aprovedInscription(id_student) {
		this._studycontrolService.aprovedInscription(id_student,this._id_class).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
				this.RefreshTable();
			},
			error => {
				console.log(<any>error)
			}
		);
	}
}
