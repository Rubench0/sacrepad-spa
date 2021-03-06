import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModelConfiguration } from '../model-configuration';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MethodsServices } from '../../services/methods.services';
import { ValidationPatterns } from 'src/app/objets/validation';
import { SKeys } from 'src/app/objets/skey';

@Component({
	selector: 'classification-subject-edit',
	templateUrl: '../edit.html',
	providers: [UserServices,ConfigurationServices,MethodsServices]
})

export class ClassificationSubjectEditComponent implements OnInit {
	public title: string;
	public label_input: string;
	public token: string;
	public identity: any;
	public modelconfiguration: ModelConfiguration;
	public modalDelete: BsModalRef;
	public roles: any;
	public desc_hash: any;
	public tablebd: string;
	public msg: string;
	public loading: boolean;
	public msgError: any;
	public msgSuccess: any;
	public validationsPatterns: ValidationPatterns;
	public sKeys: SKeys;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
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
			this.validationsPatterns = new ValidationPatterns();
			this.sKeys = new SKeys();

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], this.sKeys.secretKey);
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.modelconfiguration = new ModelConfiguration(1,"");
				this._configurationService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.loading = false;
							this.msg = 'Error en el servidor, contacte al administrador.';
							this._methodsServices.errorAlert().then((res)=>{
								this.msgError = res;
							});
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
						this.msg = 'Error en el servidor, contacte al administrador.';
						this._methodsServices.errorAlert().then((res)=>{
							this.msgError = res;
						});
					}
				);
			});
		}
	}

	openModalDelete(templateModelDelete: TemplateRef<any>) {
		this.modalDelete = this.modalService.show(templateModelDelete);
	}

	onSubmit() {
		this.loading = true;
		this._configurationService.updateData(this.modelconfiguration,this.tablebd).subscribe(
			(response:any) => {
				this.loading = false;
				if (response.status != 'success') {
					this.msg = response.msg;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.msg = response.msg;
					this.msgSuccess = true;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});
				}
			},
			error => {
				//console.log(<any>error);
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsServices.errorAlert().then((res)=>{
					this.msgError = res;
				});
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
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this._methodsServices.errorAlert().then((res)=>{
						this.msgError = res;
					});
				} else {
					this.modalDelete.hide();
					this.msg = response.msg;
					this.msgSuccess = true;
					this._methodsServices.errorAlert().then((res)=>{
						this.msgSuccess = res;
					});

					this._router.navigate(['/configuration/classificationsubjects']);
					//window.location.href = '';
				}
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this._methodsServices.errorAlert().then((res)=>{
					this.msgError = res;
				});
			}
		);
	}
}
