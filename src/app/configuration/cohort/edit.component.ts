import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cohort } from './cohort';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';
import { BsDatepickerConfig,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale); 

@Component({
	selector: 'cohort-edit',
	templateUrl: 'edit.html',
	providers: [UserServices,ConfigurationServices]
})

export class CohortEditComponent implements OnInit {
	public title: string;
	public label_input: string;
	public cohort: Cohort;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public select_active;
	public desc_hash;
	public initial;
	public finals;
	bsConfig: Partial<BsDatepickerConfig>;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location,
		private localeService: BsLocaleService
		){
			this.title = 'Cohorte';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue',  dateInputFormat: 'DD-MM-YYYY' });
			this.localeService.use('es');
			this.select_active = [
				{text: 'Activo',value: 'true'},
				{text: 'Inactivo',value: 'false'},
			];
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.cohort = new Cohort(1,"","","","","");
				this._configurationService.getCohort(this.desc_hash).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.status = 'error';
							console.log(this.status);
						} else {
							this.initial = new Date(response.data.initialDate.date);
							this.finals = new Date(response.data.finalDate.date);
							this.cohort = new Cohort(
								response.data.id,
								response.data.active,
								this.initial,
								this.finals,
								response.data.year,
								response.data.code,
							);
						}
					},
					error => {
						console.log(<any>error)
					}
				);
			});
		}
	}

	onSubmit() {
		this._configurationService.updateCohort(this.cohort).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.status = 'error';
				} else {
					this.status = 'success';
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}

	onBack() {
		this.location.back();
	}

	onDelete() {
		this._configurationService.deleteCohort(this.cohort).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.status = 'error';
				} else {
					window.location.href = '/configuration/cohorts';
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}
}