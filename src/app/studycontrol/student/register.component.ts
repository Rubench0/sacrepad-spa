import { Component, OnInit } from '@angular/core';
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
	public student: User;
	public status;
	public token;
	public identity;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Registro de facilitador';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.student = new User(1,"","","","","","","","","","","","3");
		}

		ngOnInit() {
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				//console.log('Componente register cargado con exito');
			}
		}

		onSubmit() {
			this._userService.register(this.student).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		}
}
