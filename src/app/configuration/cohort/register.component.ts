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
			this.cohort = new Cohort(1,"","","","","");
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

	onSubmit() {
		this._configurationService.cohortRegister(this.cohort).subscribe(
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
