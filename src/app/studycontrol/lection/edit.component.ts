import { Component, OnInit, TemplateRef, Renderer, ViewChild  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Lection } from './lection';
import { Dayshasclass } from './dayshasclass';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
	selector: 'lection-edit',
	templateUrl: 'edit.html',
	providers: [UserServices,StudycontrolServices]
})

export class LectionEditComponent implements OnInit {
	public title: string;
	public lection: Lection;
	public dayshasclass: Dayshasclass;
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
	public days_class;
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<LectionEditComponent> = new Subject();
	@ViewChild("templatedelete") templatedelete;
	public _id_day;
	public _id_class;

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
			this._id_day;
			this._id_class;

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
								response.data.cohort,
								response.data.classroom,
								response.data.facilitator,
								response.data.inscriptions,
								response.data.days,
							);
							this._id_class = this.lection.id;
							this.dayshasclass = new Dayshasclass(this._id_class,3,"","");
							this.dtOptions = {
								pagingType: 'full_numbers',
								responsive: true,
								scrollCollapse: false,
								paging:         false,
								searching: false,
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
									data: 'day'
								}, {
									data: 'classtime'
								}, {
									data: 'id',
									orderable:false, 
									searchable:false,
									render: function (data: any, type: any, full: any) {
										return '<button type="button" class="btn btn-outline-danger btn-sm"  send-id="'+data+'" ><i class="fas fa-trash-alt"></i> Eliminar</button>';
									}
								}],
								rowCallback: (row: Node, data: any[] | Object, index: 2) => {
									$('button', row).unbind('click');
									$('button', row).bind('click', (event) => {
										this.openModalDeleteTable(event.target.getAttribute('send-id'),this.templatedelete);
									});
									return row;
								}
							};

							this._studycontrolService.viewsDatatableDays(this.lection.id).subscribe(
								(response:any) => {
									this.days_class = response.data;
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

	onSubmit() {
		this._studycontrolService.updateData(this.lection,this.tablebd).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	onBack() {
		this._router.navigate(['/studycontrol/lections']);
	}

	onDelete() {
		this._studycontrolService.deleteDatas(this.lection,this.tablebd).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.status = 'error';
				} else {
					window.location.href = '/studycontrol/lections';
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this._studycontrolService.viewsDatatableDays(this.lection.id).subscribe(
				(response:any) => {
					this.days_class = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);
		});
	}

	onSaveClo() {
		this._studycontrolService.hasClassRegister(this.dayshasclass).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
				this.RefreshTable();
			},
			error => {
				console.log(<any>error);
			}
		);
		this.modalRef.hide();
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	openModalDeleteTable(id,templatedelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templatedelete);
		this._id_day = id;
	}

	onDeleteSchedule() {
		this._studycontrolService.deleteSchedule(this._id_day,this._id_class).subscribe(
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
}
