import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModelConfiguration } from '../model-configuration';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import * as CryptoJS from 'crypto-js';

@Component({
	selector: 'days-edit',
	templateUrl: '../edit.html',
	providers: [UserServices,ConfigurationServices]
})

export class DaysEditComponent implements OnInit {
	public title: string;
	public label_input: string;
	public modelconfiguration: ModelConfiguration;
	public status;
	public token;
	public identity;
	public roles;
	public hash;
	public desc_hash;
	public tablebd;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private location: Location
		){
			this.title = 'Días';
			this.label_input = 'Dia';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.tablebd = 'NDays';

		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
				this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
				this.modelconfiguration = new ModelConfiguration(1,"");
				this._configurationService.getData(this.desc_hash,this.tablebd).subscribe(
					(response:any) => {
						if(response.status != 'success') {
							this.status = 'error';
							console.log(this.status);
						} else {
							this.modelconfiguration = new ModelConfiguration(
								response.data.id,
								response.data.name,
							);
							//console.log(response);
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
		this._configurationService.updateData(this.modelconfiguration,this.tablebd).subscribe(
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
		this._configurationService.deleteDatas(this.modelconfiguration,this.tablebd).subscribe(
			(response:any) => {
				this.status = response.status;
				if(response.status != 'success') {
					this.status = 'error';
				} else {
					window.location.href = '/configuration/days';
				}
			},
			error => {
				console.log(<any>error)
			}
		);
	}
}
