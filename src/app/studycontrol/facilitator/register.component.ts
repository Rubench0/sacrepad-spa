import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';

@Component({
	selector: 'facilitator-register',
	templateUrl: 'register.html',
	providers: [UserServices]
})

export class FacilitatorRegisterComponent implements OnInit {
	public title: string;
	public facilitator: User;
	public status;
	public token;
	public identity;
	public msg;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private location: Location,
		private _userService: UserServices
		){
			this.title = 'Registro de facilitador';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.facilitator = new User(1,"","","","","","","","","","","","2","");
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
			//console.log('Componente register cargado con exito');
		}
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onBack() {
		this._router.navigate(['/studycontrol/facilitators']);
	}

	onSubmit() {
		this.loading = true;
		this._userService.register(this.facilitator).subscribe(
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
