import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from './subject';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';

@Component({
	selector: 'subject-register',
	templateUrl: 'register.html',
	providers: [UserServices,StudycontrolServices]
})

export class SubjectRegisterComponent implements OnInit {
	public title: string;
	public subject: Subject;
	public status;
	public msg;
	public token;
	public identity;
	public clasifications;
	public types;
	public cohorts;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private location: Location
		) {
			this.title = 'Registro de asignatura';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.subject = new Subject(1,"","","","","");
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
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
		}
	}

	onBack() {
		this.location.back();
	}

	onSubmit() {
		this._studycontrolService.subjectRegister(this.subject).subscribe(
			(response:any) => {
				this.status = response.status;
				this.msg = response.msg;
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}