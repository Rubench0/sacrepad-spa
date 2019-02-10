import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from './subject';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'subject-edit',
	templateUrl: 'edit.html',
	providers: [UserServices,StudycontrolServices]
})

export class SubjectEditComponent implements OnInit {
	public title: string;
	public label_input: string;
	public subject: Subject;
	public status;
	public token;
	public identity;
	public hash;
	public desc_hash;
	public tablebd;
	public clasifications;
	public types;
	public cohorts;
	public msg;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private location: Location
		){
			this.title = 'Asignatura';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.tablebd = 'Subject';

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.subject = new Subject(1,"","","","","");
				this._studycontrolService.get_selects('clasifications').subscribe(
					(response:any) => {
						this.clasifications = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.get_selects('types').subscribe(
					(response:any) => {
						this.types = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);
				this._studycontrolService.get_selects('cohorts').subscribe(
					(response:any) => {
						this.cohorts = response.data;
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
							this.subject = new Subject(
								response.data.id,
								response.data.name,
								response.data.description,
								response.data.classification,
								response.data.type,
								response.data.cohort,
							);
							//console.log(response);
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
		this._studycontrolService.updateData(this.subject,this.tablebd).subscribe(
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
		this._studycontrolService.deleteDatas(this.subject,this.tablebd).subscribe(
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
}
