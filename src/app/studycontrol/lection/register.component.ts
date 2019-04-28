import { Component, OnInit, ElementRef , ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Lection } from './lection';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';

@Component({
	selector: 'lection-register',
	templateUrl: 'register.html',
	providers: [UserServices,StudycontrolServices]
})

export class LectionRegisterComponent implements OnInit {
	public title: string;
	public lection: Lection;
	public status;
	public msg;
	public token;
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
		private location: Location
		) {
			this.title = 'Registro de clase';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.lection = new Lection(1,"","","","","",0,{});
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
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
		}
	}

	onBack() {
		this._router.navigate(['/studycontrol/lections']);
	}

	onSubmit() {
		this._studycontrolService.lectionRegister(this.lection).subscribe(
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