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
			this._id_class

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
								response.data.limit,
								response.data.days,
							);
							this._id_class = this.lection.id;

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
									data: 'id'
								}, {
									data: 'name'
								}, {
									data: 'identification'
								}],
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
}
