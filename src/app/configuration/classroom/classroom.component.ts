import { AfterViewInit, Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ClassRoom } from './classroom';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { ConfigurationServices } from '../../services/configuration.services';
import { DataTableDirective } from 'angular-datatables';
import * as CryptoJS from 'crypto-js';


@Component({
	selector: 'classroom-views',
	templateUrl: 'classroom.html',
	providers: [UserServices,ConfigurationServices]
})

export class ClassRoomComponent implements AfterViewInit, OnInit {
	public title: string;
	public label_input: string;
	public url_register: string;
	public token;
	public identity;
	public classroom: ClassRoom[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<ClassRoomComponent> = new Subject();

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _configurationService: ConfigurationServices,
		private http: HttpClient,
		private renderer: Renderer,
		){
			this.title = 'Aulas';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if(this.identity.rol != 'ROLE_ADMIN') {
			this._router.navigate(['/firewall']);
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
					data: 'edifice'
				},{
					data: 'floor'
				},{
					data: 'name'
				},{
					data: 'id',
					orderable:false, 
					searchable:false,
					render: function (data: any, type: any, full: any) {
						var ciphertext = CryptoJS.AES.encrypt(data, 'secret key 123').toString();
						return '<button type="button" class="btn btn-outline-primary btn-sm" view-id="'+ciphertext+'" ><i class="fas fa-edit"></i> Editar</button>';
					}
				}],
			};

			this._configurationService.viewsclassRoom().subscribe(
				(response:any) => {
					//console.log(response.data);
					this.classroom = response.data;
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
			if (event.target.hasAttribute('view-id')) {
				this._router.navigate(['configuration/classroom/edit/', event.target.getAttribute('view-id')]);
			}
		});
	}


}

