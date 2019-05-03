import { Component, OnInit, TemplateRef, Renderer, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';
import { Inscription } from './inscription';
import { Student } from './student';
import { BsDatepickerConfig,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
	public student: Student;
    public jspdf: jspdf;
    bsConfig: Partial<BsDatepickerConfig>;
    public initial;
    public finals;
    public subjects;
	public cohort;
	@ViewChild('templetecertificate') templetecertificate : TemplateRef<any>;
	public student_id;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
        private location: Location,
		private localeService: BsLocaleService,
		private _renderer: Renderer
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
			this.student_id;
		}

	ngOnInit() {
		var firewall = ['ROLE_ADMIN', 'ROLE_USER_S'];
		if (this.identity == null) {
			this._router.navigate(['/login']);
		} else if (!firewall.includes(this.identity.rol)) {
			this._router.navigate(['/firewall']);
		} else {
            this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue',  dateInputFormat: 'DD-MM-YYYY' });
			this.localeService.use('es');
			this._route.params.forEach((params: Params) => {
				var bytes  = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
				this.hash = params['id'];
                this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
                this.inscription = new Inscription(1,"","","",{});
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
                            response.data.subjects
                        );
						this.subjects = this.inscription.subjects;
                        this.cohort = this.inscription.cohort;
                        this.title = this.cohort.code;
						this.student_id = this.inscription.student_id;
                        this.initial = new Date(this.cohort.dateinitial.date);
                        this.finals = new Date(this.cohort.datefinal.date);
                        //console.log(this.inscription.cohort.dateinitial);
                    }
                });
		}
	}

	onBack() {
		this._router.navigate(['/studycontrol/cohorts/student']);
	}

	errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
	}

	onCertificate() {
		this.loading = false;
		let count_subjects = this.subjects.length;
		let count_aproved = [];
		this.subjects.forEach(subject => {
			if (subject.qualification >= 10) {
				count_aproved.push(subject.qualification);
			}
		});
		if (count_subjects === count_aproved.length) {
			this._studycontrolService.getData(this.student_id, 'Student').subscribe(
				(response: any) => {
				if (response.status != 'success') {
					this.loading = false;
					this.msgError = true;
					this.msg = 'Error en el servidor, contacte al administrador.';
					this.errorAlert();
				} else {
					this.student = new Student(
						response.data.id,
						response.data.name,
						response.data.name2,
						response.data.surname,
						response.data.surname2,
						response.data.identification,
					);
					var doc = new jspdf("l", "cm", "letter");
					//INICIO DEL MARGEN EN X 3 Y EN "Y" 3 
					// FINAL DEL MARGEN EN 26 EN X y DE "Y" EN 21
					doc.setFontSize(18);
					doc.text(11.5, 3, 'Se otorga el presente');
					doc.setFontSize(34);
					doc.text(10.5, 4.5, 'CERTIFICADO');
					doc.text(9.5, 6, 'DE APROBACIÓN');
					doc.setFontSize(18);
					doc.text(14.5, 7, 'a:');
					let name = this.student.name + ' ' + this.student.name2 + ' ' +this.student.surname + ' ' + this.student.surname2;
					name = name.toUpperCase();
					doc.setFontSize(19);
					doc.text(7, 8, name);
					doc.setFontSize(16);
					doc.text(12, 9, 'Cédula: V-' + this.student.identification);
					doc.setFontSize(18);
					var text1 = doc.splitTextToSize('Por haber cumplido con las actividades programadas y normas establecidas en el curso:', 17);
					doc.text(15, 10.5, text1, 'center');
					doc.setFontSize(19);
					doc.text(9.5, 12.5, 'COMPONENTE DOCENTE BÁSICO');
					doc.text(10.5, 13.5, 'EN EDUCACIÓN SUPERIOR');
					doc.setFontSize(14);
					var splitTitle = doc.splitTextToSize('Realizado en la Ciudad de Mérida desde el mes de marzo del año 2015 al mes de marzo del año 2016, constando de 330 horas teórico-prácticas, equivalentes a catorce(14) unidades créditos de estudios de postgrado.', 17);
					doc.text(7.5, 14.5, splitTitle);
					doc.save('certificado.pdf');
				}
			});
		} else {
			this.loading = false;
			this.msgError = true;
			this.msg = 'Debe aprobar todas las meterias para adquirir el certificado.';
			this.errorAlert();
		}
	}

	onConstancy() {
		this.loading = true;
		var doc = new jspdf("l", "cm", "letter");
		doc.text(100,5,'Se otorga el presente');
		doc.save('constancia.pdf');
		this.loading = false;
	}

}
