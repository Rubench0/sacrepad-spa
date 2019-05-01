import { Component, OnInit, TemplateRef, Renderer, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { Inscription } from './inscription';
import { BsDatepickerConfig,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

@Component({
	selector: 'view-student-inscription',
	templateUrl: 'view_student.html',
	providers: [UserServices,StudycontrolServices]
})

export class ViewStudentInscriptionComponent implements OnInit {
	public title: string;
	public status;
	public msg;
	public token;
	public hash;
	public desc_hash;
	public identity;
	public loading;
	public msgError;
    public msgSuccess;
    public tablebd;
    public inscription: Inscription;
    bsConfig: Partial<BsDatepickerConfig>;
    public initial;
    public finals;
    public subjects;
    public cohort;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
        private location: Location,
        private localeService: BsLocaleService
		){
			this.title = 'Clase';
			this.identity = this._userService.getIdentity();
            this.token = this._userService.getToken();
			this.tablebd = 'Inscription';
			this.loading = false;
			this.msgError = false;
			this.msgSuccess = false;
			this.subjects;
			this.cohort;
		}

	ngOnInit() {
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else {
            this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue',  dateInputFormat: 'DD-MM-YYYY' });
			this.localeService.use('es');
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
                this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
                this.inscription = new Inscription(1,"","","",{},{});
            });
            this._studycontrolService.getData(this.desc_hash,this.tablebd).subscribe(
                (response:any) => {
                    if (response.status != 'success') {
                        this.loading = false;
                        this.msgError = true;
                        this.msg = 'Error en el servidor, contacte al administrador.';
                        this.errorAlert();
                    } else {
                        this.inscription = new Inscription(
                            response.data.id,
                            response.data.cohort,
                            response.data.student_id,
                            response.data.aproved,
                            response.data.subjects,
                            response.data.hassday,
                        );
                        console.log(this.inscription.hassday);
                        this.subjects = this.inscription.subjects;
                        this.cohort = this.inscription.cohort;
                        this.title = this.cohort.code;
                        this.initial = new Date(this.cohort.dateinitial.date);
                        this.finals = new Date(this.cohort.datefinal.date);
                        //console.log(this.inscription.cohort.dateinitial);
                    }
                });
		}
	}

	onBack() {
		this._router.navigate(['/studycontrol/inscriptions']);
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
    }

}
