import { AfterViewInit, Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './user';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { DataTableDirective } from 'angular-datatables';
import * as CryptoJS from 'crypto-js';


@Component({
	selector: 'users-views',
	templateUrl: 'users.html',
	providers: [UserServices]
})

export class UsersComponent implements AfterViewInit, OnInit {
	public title: string;
	public token;
	public identity;
	public users: User[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<UsersComponent> = new Subject();

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private http: HttpClient,
		private renderer: Renderer
		){
			this.title = 'Usuarios';
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
				columns: [{
					data: 'login'
				}, {
					data: 'email'
				}, {
					data: 'id',
					orderable:false, 
					searchable:false,
					render: function (data: any, type: any, full: any) {
						var ciphertext = CryptoJS.AES.encrypt(data, 'secret key 123').toString();
						return '<button type="button" class="btn btn-outline-primary btn-sm" view-user-id="'+ciphertext+'"><i class="fas fa-search"></i> Ver / <i class="fas fa-edit"></i> Editar</button>';
					}
				}],
			};
					
			this._userService.views().subscribe(
				(response:any) => {
					//console.log(response.data);
					this.users = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);


			
		}

	}

	ngAfterViewInit() {
		this.renderer.listenGlobal('document', 'click', (event) => {
			if (event.target.hasAttribute('view-user-id')) {
				this._router.navigate(['/users/edit', event.target.getAttribute('view-user-id')]);
			}
		});
	}
}

