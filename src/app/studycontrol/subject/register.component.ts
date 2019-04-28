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
	public token;
	public identity;
	public clasifications;
	public types;
	public cohorts;
	public msg;
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
			this.title = 'Registro de asignatura';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.subject = new Subject(1,"","","","","");
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
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
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error al cargar clasificaciones, recargue la página.';
					this.errorAlert();
				}
			);
			this._studycontrolService.get_selects('types').subscribe(
				(response:any) => {
					this.types = response.data;
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error al cargar tipos, recargue la página.';
					this.errorAlert();
				}
			);
			this._studycontrolService.get_selects('cohorts').subscribe(
				(response:any) => {
					this.cohorts = response.data;
				},
				error => {
					//console.log(<any>error);
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error al cargar cursos, recargue la página.';
					this.errorAlert();
				}
			);
		}
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onBack() {
		this._router.navigate(['/studycontrol/subjects']);
	}

	onSubmit() {
		this.loading = true;
		this._studycontrolService.subjectRegister(this.subject).subscribe(
			(response:any) => {
				this.loading = false;
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