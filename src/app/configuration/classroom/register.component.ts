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
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			//console.log('Componente register cargado con exito');
		}
	}

	onBack() {
		this.location.back();
	}

	onSubmit() {
		this._configurationService.classRoomRegister(this.classroom).subscribe(
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
