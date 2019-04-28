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
	selector: 'lection-view-facilitator',
	templateUrl: 'view_facilitator.html',
	providers: [UserServices,StudycontrolServices]
})

export class SubjectViewFacilitatorComponent implements OnInit {
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
	public dtTrigger: Subject<SubjectViewFacilitatorComponent> = new Subject();
	@ViewChild("templatedelete") templatedelete;
	public _id_day;
	public _id_class;
	public inscriptions;
	public _inscriptions;

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
			this.inscriptions;
			this._inscriptions;

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
								response.data.subject.cohort,
								response.data.classroom.name,
								response.data.facilitator.name,
								response.data.inscriptions,
								response.data.days,
							);
							this._id_class = this.lection.id;
							this.days_class = this.lection.days;
							this.inscriptions = this.lection.inscriptions;
							this._inscriptions = this.inscriptions.length;
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
		this._router.navigate(['/studycontrol/lections']);
	}
}
