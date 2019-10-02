import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
    selector: 'subjects-student',
    templateUrl: './subjectstudent.html',
    providers: [UserServices, StudycontrolServices]
})

export class SubjectsStudentComponent implements OnInit {
    public title: string;
    public user: User;
    public status;
    public token;
    public identity;
    public hash;
    public desc_hash;
    public id_inscrip;
    public tablebd;
    public subjectstudent
    public modalInscription: BsModalRef;
    public modalDesInscription: BsModalRef;
    @ViewChild(DataTableDirective)
	public dtElement: DataTableDirective;
	public dtOptions: DataTables.Settings = {};
    public dtTrigger: Subject<SubjectsStudentComponent> = new Subject();
    @ViewChild("templateModelDesInscription") templateModelDesInscription;
    public loading;
	public msgError;
	public msgSuccess;
	public cohorts;
	public cohort;
    msg: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserServices,
        private _studycontrolService: StudycontrolServices,
        private location: Location,
        private modalService: BsModalService,
        private renderer: Renderer
    ) {
        this.title = 'Inscripciones';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.tablebd = 'Cohort-Student';

    }

    ngOnInit() {
        if (this.identity == null) {
            this._router.navigate(['/login']);
        } else {
            this._route.params.forEach((params: Params) => {
                var bytes = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
                this.hash = params['id'];
                this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);

                this._studycontrolService.get_selects('cohorts').subscribe(
					(response: any) => {
						this.cohorts = response.data;
					},
					error => {
						console.log(<any>error);
					}
				);

                this.dtOptions = {
                    pagingType: 'full_numbers',
                    responsive: true,
                    scrollY:        '40vh',
                    scrollCollapse: true,
                    paging:         false,
                    searching: false,
                    info: false,
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
                        data: 'cohort'
                    }, {
                        data: 'aproved',
                        render: function (data: any, type: any, full: any) {
                            if (data == 'true') {
                                return '<div class="text-success"><b>Aprobada</b></div>';
                            } else {
                                return '<div class="text-danger"><b>Sin aprobar</b></div>';
                            }
                        }
                    }, {
                        data: 'id',
                        orderable:false,
                        searchable:false,
                        render: function (data: any, type: any, full: any) {
                            var ciphertext = CryptoJS.AES.encrypt(data, 'secret key 123').toString();
                            return '<button type="button" class="btn btn-outline-danger btn-sm" view-id="'+ciphertext+'"><i class="fas fa-trash"></i></button>';
                        }
                    }],
                    rowCallback: (row, data) => {
                        $('td:eq(2) button', row).unbind('click');
                        $('td:eq(2) button', row).bind('click', (event) => {
                            this.openModalDesInscription($('td:eq(2) button', row).attr('view-id'), this.templateModelDesInscription);
                        });
                        return row;
                    }
                };

                this._studycontrolService.getData(this.desc_hash, this.tablebd).subscribe(
                    (response: any) => {
                        this.subjectstudent = response.data;
					    this.dtTrigger.next();
                    },
                    error => {
                        console.log(<any>error)
                    }
                );
            });
        }
    }

    openModalInscription(templateModelInscription: TemplateRef<any>) {
		this.modalInscription = this.modalService.show(templateModelInscription);
    }
    
    openModalDesInscription(id, templateModelDesInscription: TemplateRef<any>) {
        var bytes  = CryptoJS.AES.decrypt(id, 'secret key 123');
		this.modalDesInscription = this.modalService.show(templateModelDesInscription);
        this.id_inscrip = bytes.toString(CryptoJS.enc.Utf8);
    }

    errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
    }
    
    RefreshTable() {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
            this._studycontrolService.getData(this.desc_hash, this.tablebd).subscribe(
                (response: any) => {
                    this.subjectstudent = response.data;
                    this.dtTrigger.next();
                },
                error => {
                    this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
                }
            );
		});
	}

    onPreInscription() {
        this.loading = true;
		this._studycontrolService.preInscription(this.desc_hash,this.cohort).subscribe(
			(response:any) => {
				this.loading = false;
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
                this.modalInscription.hide();
				this.RefreshTable();
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
    }

    onDesInscription() {
        this.loading = true;
		this._studycontrolService.desInscription(this.id_inscrip).subscribe(
			(response:any) => {
				this.loading = false;
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
                this.modalDesInscription.hide();
				this.RefreshTable();
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
    }
}
