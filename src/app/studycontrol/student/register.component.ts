import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import { ValidationPatterns } from '../../objets/validation';

@Component({
	selector: 'student-register',
	templateUrl: 'register.html',
	providers: [UserServices,StudycontrolServices]
})

export class StudentRegisterComponent implements OnInit {
	public title: string;
	public loading;
	public student: User;
	public status;
	public token;
	public identity;
	public msg;
	public msgError;
	public cohorts;
	public algo;
	public validationsPatterns: ValidationPatterns;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private location: Location,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices
		){
			this.title = 'Pre-Inscripción del aspirante';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.student = new User(1,'',"","","","","","","","","","","3","",true);
			this.loading = false;
			this.msgError = false;
			this.cohorts;
			this.validationsPatterns = new ValidationPatterns();
		}

		ngOnInit() {
			// if (this.identity == null) {
			// 	this._router.navigate(['/login']);
			// } else {
			// 	//console.log('Componente register cargado con exito');
			// }
			this._studycontrolService.get_selects_not_auth('cohorts').subscribe(
				(response:any) => {
					this.cohorts = response.data;
				},
				error => {
					console.log(<any>error);
				}
			);
		}

		onBack() {
			this._router.navigate(['/studycontrol/students']);
		}

		onLoginBack() {
			this._router.navigate(['/login']);
		}

		onSubmit() {
			this.loading = true;
			this._userService.InscriptionUser(this.student).subscribe(
				(response:any) => {
					this.status = response.status;
					this.loading = false;
					if(response.status != 'success') {
						this.msgError = true;
						this.status = 'error';
						this.msg = response.msg;
						setTimeout(() => {
							this.msgError = false;
						}, 5000);
					} else {
						this.msg = response.msg;
						if (this.identity != null) {
							setTimeout(() => {
								this._router.navigate(['/studycontrol/students']);
							},5000);
						} else {
							setTimeout(() => {
								this._router.navigate(['/login']);
							},5000);
						}
					}
				},
				error => {
					//console.log(<any>error);
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador';
					setTimeout(() => {
						this.msgError = false;
					}, 5000);
				}
			);
		}
}
