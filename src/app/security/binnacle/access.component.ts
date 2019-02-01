import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Access } from './access';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { BinnacleServices } from '../../services/binnacle.services';
import { DataTableDirective } from 'angular-datatables';


@Component({
	selector: 'binnacle-access-views',
	templateUrl: 'access.html',
	providers: [BinnacleServices]
})

export class BinnacleAccessComponent implements OnInit {
	public title: string;
	public token;
	public identity;
	public access: Access[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<BinnacleAccessComponent> = new Subject();

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _binnacleService: BinnacleServices,
		private renderer: Renderer
		){
			this.title = 'Bitacora de accesos';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
			this.dtOptions = {
				pagingType: 'full_numbers',
				responsive: true,
				scrollY:        '40vh',
				scrollCollapse: true,
				paging:         true,
				language: {
					"lengthMenu":     "Mostrar _MENU_ registros",
					"zeroRecords":    "No se encontraron coincidencias",
					"info":           "<b>Total de registros: _TOTAL_</b> ",
					"infoEmpty":      "0 de un total de 0 registros",
					"infoFiltered":   "(filtrado de _MAX_ registros)",
					"paginate": {
						"first":    "<i class='fas fa-less-than-equal'></i>",
						"last":     "<i class='fas fa-greater-than-equal'></i>",
						"next":     "<i class='fas fa-greater-than'></i>",
						"previous": "<i class='fas fa-less-than'></i>"
					},
					"processing":     "<b>Procesando...</b>",
					"emptyTable":     "Ningún dato disponible en esta tabla",
					"search":         "<b>Buscar:</b>",
					"loadingRecords": "Cargando...",
				},
			};
					
			this._binnacleService.getAccess().subscribe(
				(response:any) => {
					this.access = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);


			
		}

	}
}

