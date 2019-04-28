import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClassRoom } from './classroom';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'classroom-edit',
	templateUrl: 'edit.html',
	providers: [UserServices,ConfigurationServices]
})

export class ClassRoomEditComponent implements OnInit {
	public title: string;
	public label_input: string;
	public classroom: ClassRoom;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public select_active;
	public desc_hash;
	public msg;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location
		){
			this.title = 'Aula';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.classroom = new ClassRoom(1,"","","");
				this._configurationService.getclassRoom(this.desc_hash).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this.errorAlert();
						} else {
							this.classroom = new ClassRoom(
								response.data.id,
								response.data.edifice,
								response.data.floor,
								response.data.name,
							);
						}
					},
					error => {
						//console.log(<any>error)
						this.loading = false;
						this.msgError = true;
						this.msg = 'Error en el servidor, contacte al administrador.';
						this.errorAlert();
					}
				);
			});
		}
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onSubmit() {
		this.loading = true;
		this._configurationService.updateclassRoom(this.classroom).subscribe(
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

	onBack() {
		this._router.navigate(['/configuration/classrooms']);
	}

	onDelete() {
		this.loading = true;
		this._configurationService.deleteclassRoom(this.classroom).subscribe(
			(response:any) => {
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
					window.location.href = '/configuration/classrooms';
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
