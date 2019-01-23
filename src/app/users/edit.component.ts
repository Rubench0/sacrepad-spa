import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './user';
import { UserServices } from '../services/user.services';

@Component({
	selector: 'users-edit',
	templateUrl: 'edit.html',
	providers: [UserServices]
})

export class UserEditComponent implements OnInit {
	public title: string;
	public user: User;
	public status;
	public token;
	public identity;
	public roles;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices
		){
			this.title = 'Modificar datos de usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}

		ngOnInit() {
			//console.log('Componente modificar cargado con exito');
			if (this.identity == null) {
				this._router.navigate(['/login']);
			} else {
				this.roles = [
					{text: 'Usuario',value: 'ROLE_USER'},
					{text: 'Administrador',value: 'ROLE_ADMIN'},
				];
				this.user = new User(
					this.identity.sub,
					this.identity.login,
					this.identity.password,
					this.identity.email,
					this.identity.role,
					this.identity.name,
					this.identity.surname,
					this.identity.phone,
				);
			}
		}

		onSubmit() {
			this._userService.update(this.user).subscribe(
				(response:any) => {
					this.status = response.status;
					if(response.status != 'success') {
						this.status = 'error';
					} else {
						localStorage.setItem('identity', JSON.stringify(this.user));
					}
				},
				error => {
					console.log(<any>error)
				}
			);
		}
}
