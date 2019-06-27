import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'students-edit',
	templateUrl: '../../security/users/edit.html',
	providers: [UserServices]
})

export class StudentEditComponent implements OnInit {
	public title: string;
	public user: User;
	public modalDelete: BsModalRef;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public desc_hash;
	public roledit;
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
			this.title = 'Estudiante';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
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
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.roles = [
					{ text: 'Usuario', value: 'ROLE_USER' },
					{ text: 'Administrador', value: 'ROLE_ADMIN' },
					{ text: 'Estudiante', value: 'ROLE_USER_S' },
					{ text: 'Facilitador', value: 'ROLE_USER_F' },
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
							this.roledit = false;
						}
					},
					error => {
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

	openModalDelete(templateModelDelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateModelDelete);
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
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
	}

	onBack() {
		this._router.navigate(['/studycontrol/students']);
	}

	onDelete() {
		this.loading = true;
		this._userService.deleteUser(this.user).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				} else {
					this.msg = response.msg;
					this.modalDelete.hide();
					this.msgSuccess = true;
					setTimeout(() => {
						this.msgSuccess = false;
					}, 2000);
					this._router.navigate(['/studycontrol/students']);
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
