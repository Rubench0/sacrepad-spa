import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Cohort } from './cohort';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import { BsDatepickerConfig,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale); 

@Component({
	selector: 'cohort-register',
	templateUrl: 'register.html',
	providers: [UserServices,ConfigurationServices]
})

export class CohortRegisterComponent implements OnInit {
	public title: string;
	public label_input: string;
	public cohort: Cohort;
	public status;
	public msg;
	public token;
	public identity;
	bsConfig: Partial<BsDatepickerConfig>;
	public loading;
	public msgError;
	public msgSuccess;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location,
		private localeService: BsLocaleService
		) {
			this.title = 'Registro de cohorte';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.cohort = new Cohort(1,0,"","","","",0);
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue',  dateInputFormat: 'DD-MM-YYYY' });
			this.localeService.use('es');
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
		this._configurationService.cohortRegister(this.cohort).subscribe(
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
}
