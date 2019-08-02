import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModelConfiguration } from '../model-configuration';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MethodsServices } from '../../services/methods.services';

@Component({
	selector: 'classification-subject-edit',
	templateUrl: '../edit.html',
	providers: [UserServices,ConfigurationServices,MethodsServices]
})

export class ClassificationSubjectEditComponent implements OnInit {
	public title: string;
	public label_input: string;
	public modelconfiguration: ModelConfiguration;
	public modalDelete: BsModalRef;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public desc_hash;
	public tablebd;
	public msg;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location,
		private modalService: BsModalService,
		private _methodsServices: MethodsServices,
		){
			this.title = 'Clasificación de módulo';
			this.label_input = 'Clasificación';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.tablebd = 'NClassificationSubject';
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
				this.modelconfiguration = new ModelConfiguration(1,"");
				this._configurationService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msgError = true;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this.errorAlert();
						} else {
							this.modelconfiguration = new ModelConfiguration(
								response.data.id,
								response.data.name,
							);
							//console.log(response);
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
		this._configurationService.updateData(this.modelconfiguration,this.tablebd).subscribe(
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
		this._router.navigate(['/configuration/classificationsubjects']);
	}

	onDelete() {
		this.loading = true;
		this._configurationService.deleteDatas(this.modelconfiguration,this.tablebd).subscribe(
			(response:any) => {
				this.status = response.status;
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				} else {
					this.modalDelete.hide();
					this.msg = response.msg;
					this.msgSuccess = true;
					setTimeout(() => {
						this.msgSuccess = false;
					}, 2000);

					this._router.navigate(['/configuration/classificationsubjects']);
					//window.location.href = '';
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
