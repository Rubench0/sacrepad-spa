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
	public cohorts;
	public days;
	public marked;
	public loading;
	public msgError;
	public msgSuccess;

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
			this._studycontrolService.get_selects('subjects').subscribe(
				(response:any) => {
					this.subjects = response.data;
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

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onSubmit() {
		this.loading = true;
		this._studycontrolService.lectionRegister(this.lection).subscribe(
			(response:any) => {
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
			},
			error => {
				//console.log(<any>error);
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

}