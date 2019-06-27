import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './user';
import { UserServices } from '../../services/user.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'user-edit',
	templateUrl: 'edit.html',
	providers: [UserServices]
})

export class UserEditComponent implements OnInit {
	public title: string;
	public user: User;
	public modalDelete: BsModalRef;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public desc_hash;
	public msg;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private location: Location,
		private modalService: BsModalService
		){
			this.title = 'Usuario';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;

	}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.roles = [
					{text: 'Usuario',value: 'ROLE_USER'},
					{text: 'Administrador',value: 'ROLE_ADMIN'},
					{text: 'Estudiante',value: 'ROLE_USER_S'},
					{text: 'Facilitador',value: 'ROLE_USER_F'},
				];
				this.user = new User(1,"","","","","","","","","","","","","",true);
				this._userService.getUser(this.desc_hash).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this.errorAlert();
						} else {
							if (response.data.type == '1') {
								this.user = new User(
									response.data.id,
									response.data.login,
									response.data.password,
									response.data.email,
									response.data.rol,
									response.data.name,
									response.data.surname,
									response.data.phone,
									"",
									"",
									"",
									"",
									response.data.type,
									"",
									response.data.active
								);
							} else if (response.data.type == '2') {
								this.user = new User(
									response.data.id,
									response.data.login,
									response.data.password,
									response.data.email,
									response.data.rol,
									response.data.name,
									response.data.surname,
									response.data.phone,
									response.data.identification,
									response.data.profession,
									"",
									"",
									response.data.type,
									"",
									response.data.active
								);
							} else if (response.data.type == '3') {
								this.user = new User(
									response.data.id,
									response.data.login,
									response.data.password,
									response.data.email,
									response.data.rol,
									response.data.name,
									response.data.surname,
									response.data.phone,
									response.data.identification,
									"",
									response.data.name2,
									response.data.surname2,
									response.data.type,
									"",
									response.data.active

								);
							}
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

	onSubmit() {
		this.loading = true;
		this._userService.updateUser(this.user).subscribe(
			(response:any) => {
				this.loading = false;
				this.status = response.status;
				if (response.status != 'success') {
					this.loading = false;
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
				//console.log(<any>error)
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

	onBack() {
		this._router.navigate(['/users']);
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onDelete() {
		this.loading = true;
		this._userService.deleteUser(this.user).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this.errorAlert();
				} else {
					this._router.navigate(['/users']);
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

	activeUser(status) {
		if (status == true) {
			this.user.active = false;
		} else {
			this.user.active = true;
		}
		this._userService.changestatusUser(this.user.active,this.user.id).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = response.msg;
					this.errorAlert();
				} else {
					this.loading = false;
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

	openModalDelete(templateModelDelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateModelDelete);
	}
}
