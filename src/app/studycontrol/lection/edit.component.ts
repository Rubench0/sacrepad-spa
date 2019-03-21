import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Lection } from './lection';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'lection-edit',
	templateUrl: 'edit.html',
	providers: [UserServices,StudycontrolServices]
})

export class LectionEditComponent implements OnInit {
	public title: string;
	public lection: Lection;
	public modalRef: BsModalRef;
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

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.lection = new Lection(1,"","","","",{});
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
								response.data.days,
							);
							this.days = this.lection.days;
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
		this.location.back();
	}

	onDelete() {
		this._studycontrolService.deleteDatas(this.lection,this.tablebd).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.status = 'error';
				} else {
					window.location.href = '/studycontrol/subjects';
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
}
