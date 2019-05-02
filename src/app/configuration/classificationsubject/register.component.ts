import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ModelConfiguration } from '../model-configuration';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';

@Component({
	selector: 'classification-subject-register',
	templateUrl: '../register-modelconfiguration.html',
	providers: [UserServices,ConfigurationServices]
})

export class ClassificationSubjectRegisterComponent implements OnInit {
	public title: string;
	public label_input: string;
	public modelconfiguration: ModelConfiguration;
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
			this.title = 'Registro de clasificación de asignatura';
			this.label_input = 'Clasificación';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.modelconfiguration = new ModelConfiguration(1,"");
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
			//console.log('Componente register cargado con exito');
		}
	}

	onBack() {
		this.location.back();
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onSubmit() {
		this.loading = true;
		this._configurationService.classSubjectRegister(this.modelconfiguration).subscribe(
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
