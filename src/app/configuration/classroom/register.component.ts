import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ClassRoom } from './classroom';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';

@Component({
	selector: 'classroom-register',
	templateUrl: 'register.html',
	providers: [UserServices,ConfigurationServices]
})

export class ClassRoomRegisterComponent implements OnInit {
	public title: string;
	public classroom: ClassRoom;
	public status;
	public msg;
	public token;
	public identity;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location
		) {
			this.title = 'Registro de aula';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.classroom = new ClassRoom(1,"","","");
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			//console.log('Componente register cargado con exito');
		}
	}

	onBack() {
		this._router.navigate(['/configuration/classrooms']);
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onSubmit() {
		this.loading = true;
		this._configurationService.classRoomRegister(this.classroom).subscribe(
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
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}
}
