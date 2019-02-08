import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cohort } from './cohort';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
	bsConfig: Partial<BsDatepickerConfig>;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location
		){
			this.title = 'Cohorte';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' });
			this.select_active = [
				{text: 'Activar',value: '1'},
				{text: 'Desactivar',value: '0'},
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
							this.cohort = new Cohort(
								response.data.id,
								response.data.active,
								response.data.initialDate.date,
								response.data.finalDate.date,
								response.data.year,
								response.data.code,
							);
							console.log(response);
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
