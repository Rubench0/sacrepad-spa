import { AfterViewInit, Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Lection } from './lection';
import { Subject } from 'rxjs';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import { DataTableDirective } from 'angular-datatables';
import * as CryptoJS from 'crypto-js';


@Component({
	selector: 'lection-views',
	templateUrl: 'lection.html',
	providers: [UserServices,StudycontrolServices]
})

export class LectionsComponent implements AfterViewInit, OnInit {
	public title: string;
	public token;
	public identity;
	public table;
	public lections: Lection[];
	@ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
	public dtTrigger: Subject<LectionsComponent> = new Subject();

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private http: HttpClient,
		private renderer: Renderer
		){
			this.title = 'Clases';
			this.identity = this._userService.getIdentity();
			this.token = this._userService.getToken();
			this.table = 'Lection';
		}

	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_USER_F'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
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
					data: 'code'
				}, {
					data: 'subject'
				}, {
					data: 'classroom'
				}, {
					data: 'facilitator'
				}, {
					data: 'id',
					orderable:false,
					searchable:false,
					render: function (data: any, type: any, full: any) {
						var ciphertext = CryptoJS.AES.encrypt(data, 'secret key 123').toString();
						return '<button type="button" class="btn btn-outline-primary btn-sm" view-id="'+ciphertext+'"><i class="fas fa-search"></i> Ver / <i class="fas fa-edit"></i> Editar</button>';
					}
				}],
			};
			this._studycontrolService.viewsDatatable(this.table).subscribe(
				(response:any) => {
					//console.log(response.data);
					this.lections = response.data;
					this.dtTrigger.next();
				},
				error => {
					console.log(<any>error)
				}
			);
		}

	}

	ngAfterViewInit() {
		let path;
		this.renderer.listenGlobal('document', 'click', (event) => {
			if (event.target.hasAttribute('view-id')) {
				if (this.identity.rol == 'ROLE_ADMIN' || this.identity.rol == 'ROLE_USER') {
					path = '/studycontrol/lection/edit';
				} else if (this.identity.rol == 'ROLE_USER_F') {
					path = '/studycontrol/lection/facilitator';
				} else {
					path = '/studycontrol/lection/student';
				}
				this._router.navigate([path, event.target.getAttribute('view-id')]);
			}
		});
	}
}

