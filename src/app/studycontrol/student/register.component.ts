import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';

@Component({
	selector: 'student-register',
	templateUrl: 'register.html',
	providers: [UserServices]
})

export class StudentRegisterComponent implements OnInit {
	public title: string;
	public loading;
	public student: User;
	public status;
	public token;
	public identity;
	public msg;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private location: Location,
		private _userService: UserServices
		){
			this.title = 'Registro de estudiante';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.student = new User(1,"","","","","","","","","","","","3");
			this.loading = false;
		}

		ngOnInit() {
			// if (this.identity == null) {
			// 	this._router.navigate(['/login']);
			// } else {
			// 	//console.log('Componente register cargado con exito');
			// }
		}

		onBack() {
			this.location.back();
		}

		onSubmit() {
			this.loading = true;
			this._userService.InscriptionUser(this.student).subscribe(
				(response:any) => {
					this.status = response.status;
					this.loading = false;
					if(response.status != 'success') {
						this.status = 'error';
						this.msg = response.msg;
						setTimeout(() => {
							this.status;
						}, 5000);
					} else {
						this.msg = response.msg;
						setTimeout(() => {
							this._router.navigate(['/login']);
						},5000);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		}
}
