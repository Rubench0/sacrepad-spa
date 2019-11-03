/**
 * This file is part of "SAPRCEPAD"
 * Copyright (c) 2019 "PROGRAMA DE ACTUALIZACIÓN DOCENTE DE LA UNIVERSIDAD DE LOS ANDES"
 * All rights reserved
 *
 * @author Rubench0 <rubenchoo.garcia@gmail.com>
 * @version 1.0
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { BinnacleServices } from '../../services/binnacle.services';
import { DataTableDirective } from 'angular-datatables';
import { OptionsTable } from '../../objets/optionsTable';

/**
 * Componente de seguridad que permite visualizar los respaldos de base de datos.
 *
 * @export
 * @class DatabaseComponent
 * @implements {OnInit}
 */

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css'],
  providers: [BinnacleServices]
})
export class DatabaseComponent implements OnInit {

  	public title: string;
	public token: string;
	public identity: any;
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<DatabaseComponent> = new Subject();
  	public optionsTable: any;
  	public databases: any;
  
  constructor(
    private _router: Router,
		private _userService: UserServices,
		private _binnacleService: BinnacleServices
  ) { 
    this.title = 'Respaldos de base de datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.optionsTable = new OptionsTable();
  }

  ngOnInit() {
    if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
		} else {
			this.optionsTable.options.columns = [{
				data: 'date'
			}, {
				data: 'name'
			}, {
				data: 'download',
				orderable:false,
				searchable:false,
				render: function (data: any, type: any, full: any) {
					return '<a class="btn btn-outline-primary btn-sm" href="'+data+'" ><i class="fas fa-download"></i> Descargar</a>';
				}
			}];
			this.dtOptions = this.optionsTable.options;
			this._binnacleService.listDB().subscribe(
				(response:any) => {
					this.databases = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error);
				}
			);
		}
  }

  backupBD() {
		this._binnacleService.backupDB().subscribe(
			(response:any) => {
				console.log(response);
			},
			error => {
				console.log(<any>error);
			}
		);
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this._binnacleService.listDB().subscribe(
				(response:any) => {
					this.databases = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

}
