import { Component, OnInit, TemplateRef, Renderer, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import { MethodsServices } from '../../services/methods.services';
import * as CryptoJS from 'crypto-js';
import { Inscription } from './inscription';
import { Student } from './student';
import { BsDatepickerConfig,BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);
import * as jspdf from 'jspdf';

@Component({
	selector: 'view-student-inscription',
	templateUrl: 'view_student.html',
	providers: [UserServices, StudycontrolServices, MethodsServices]
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
	public finalqualitificaction;
	public aproved: any;


	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserServices,
		private _studycontrolService: StudycontrolServices,
		private _methodsService: MethodsServices,
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
			this.finalqualitificaction;
			this.aproved = true;
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
						for (var i = 0; i < this.subjects.length; i++) {
							if (this.subjects[i].qualification < 14) {
								this.aproved = false;
								break;
							}
						}
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
					this._studycontrolService.getFinalQualifications(this.student.id).subscribe(
						(response: any) => {
							this.finalqualitificaction = response.data;
							var logoUla = new Image();
							var logoCep = new Image();
							var logoPad = new Image();
							logoUla.src = 'assets/img/ula.png';
							logoCep.src = 'assets/img/cep.png';
							logoPad.src = 'assets/img/pad.png';
							var doc = new jspdf("l", "cm", "letter");
							doc.addImage(logoUla, 'PNG', 1, 2);
							doc.addImage(logoCep, 'PNG', 1, 6);
							doc.addImage(logoPad, 'PNG', 1, 9);
							//INICIO DEL MARGEN EN X 3 Y EN "Y" 3
							// FINAL DEL MARGEN EN 26 EN X y DE "Y" EN 21
							doc.setFontSize(18);
							doc.setTextColor(13,54,146);
							doc.text(11.5, 3, 'Se otorga el presente');
							doc.setFontSize(34);
							doc.setTextColor(22,162,22);
							doc.setFontType("bold");
							doc.text(10.5, 4.5, 'CERTIFICADO');
							doc.text(9.5, 6, 'DE APROBACIÓN');
							doc.setTextColor(13,54,146);
							doc.setFontType("normal");
							doc.setFontSize(18);
							doc.text(14.5, 7, 'a:');
							let name = this.student.name + ' ' + this.student.name2 + ' ' +this.student.surname + ' ' + this.student.surname2;
							name = name.toUpperCase();
							doc.setFontSize(19);
							doc.text(16, 8, name,'center');
							doc.setFontSize(16);
							doc.text(15, 9, 'Cédula: V-' + this.student.identification,'center');
							doc.setFontSize(18);
							doc.setFontType("bold");
							var text1 = doc.splitTextToSize('Por haber cumplido con las actividades programadas y normas establecidas en el curso:', 17);
							doc.text(16, 10.5, text1, 'center');
							doc.setFontSize(19);
							doc.setFontType("normal");
							doc.text(10, 12.5, 'COMPONENTE DOCENTE BÁSICO');
							doc.text(11, 13.5, 'EN EDUCACIÓN SUPERIOR');
							doc.setFontSize(14);
							var splitTitle = doc.splitTextToSize('Realizado en la Ciudad de Mérida desde el mes de marzo del año 2015 al mes de marzo del año 2016, constando de 330 horas teórico-prácticas, equivalentes a catorce(14) unidades créditos de estudios de postgrado.', 17);
							doc.text(splitTitle, 7.5, 14.5, {maxWidth: 16.9, align: "justify"});
							doc.setFontSize(12);
							doc.text(4.1, 18.5, '_________________________','center');
							doc.text(4.1, 19.1, 'Dr. Mario Bonucci Rossini','center');
							doc.text(4.1, 19.7, 'Rector','center');
							doc.text(10.8, 18.5, '_________________________','center');
							doc.text(10.8, 19.1, 'Dra. Patricia Rosenzweig Levy','center');
							doc.text(10.8, 19.7, 'Vicerrectora Académica','center');
							doc.text(17.3, 18.5, '_________________________','center');
							doc.text(17.3, 19.1, 'Dra. Laura Calderón','center');
							doc.text(17.3, 19.7, 'Coordinadora General CEP','center');
							doc.text(23.9, 18.5, '_________________________','center');
							doc.text(23.9, 19.1, 'Dra. Alix Madrid','center');
							doc.text(23.9, 19.7, 'Coordinadora PAD','center');
							doc.addPage();
							var qualification1 = this._methodsService.NumberLetters(this.finalqualitificaction);
							var udc = this._methodsService.NumberLetters(14);
							doc.setFontSize(19);
							doc.setTextColor(13,54,146);
							doc.text(3, 3, 'CALIFICACIÓN: _________________');
							doc.text(8.7, 3, qualification1+' ptos');
							doc.setDrawColor(13, 54, 146);
							doc.setLineWidth(0.001);
							//cuadros 1
							doc.rect(14.9, 2.2, 1, 1,'S');
							doc.rect(14.9, 3.2, 1, 1,'S');
							//cuadros 2
							doc.rect(3, 9.3, 3, 1,'S');
							doc.rect(6, 9.3, 3.9, 1,'S');
							doc.rect(9.9, 9.3, 6, 1,'S');
							//cuadros 3
							doc.rect(2.8, 11.5, 7.4, 6, 'S');
							doc.rect(10.2, 11.5, 7.5, 6, 'S');
							doc.rect(17.7, 11.5, 7.6, 6, 'S');
							doc.setLineWidth(0.1);
							doc.rect(2.8, 5, 22.5, 3, 'S');
							doc.setFontSize(18);
							doc.text(15, 3, this.finalqualitificaction.toString());
							doc.setFontSize(15);
							doc.text(17, 3, 'Escala: 01 a 20 puntos');
							doc.setFontSize(19);
							doc.text(10.2, 4, udc);
							doc.text(3, 4, 'UNIDADES CREDITO:  ___________');
							doc.setFontSize(18);
							doc.text(15, 4, '14');
							doc.setFontSize(18);
							doc.text(3, 5.7, 'TELLERES:');
							var talleres = doc.splitTextToSize('Lectura y escritura del discurso académico, Didáctica del aula universitaria, Docencia en ambientes virtuales, Elementos y aplicaciones para el diseño genérico de una docencia estratégica, Evaluación por competencias, Portafolio Electrónico Digital.', 29);
							doc.setFontSize(14);
							doc.text(talleres, 3, 6.5, {maxWidth: 21.7, align: "justify"});
							doc.setFontSize(16);
							doc.setFontType("bold");
							doc.text(3, 9, 'Registro del Consejo de Estudios de Postgrado:');
							doc.setFontType("normal");
							doc.text(3.2, 10, 'Nº');
							doc.text(6.1, 10, 'Libro:');
							doc.text(10, 10, 'Fecha:');
							doc.text(17.5, 9.6, '________________________');
							doc.setFontSize(12);
							doc.setFontType("bold");
							doc.text(19, 10.2, 'Unidad de Planificación');
							doc.text(18.1, 10.8, 'Consejo de Estudios de Postgrado');
							doc.setFontSize(11);
							doc.text(3, 12, 'Normas Académicas:');
							doc.text(3, 12.4, 'Certificado de Asistencia:');
							doc.setFontType("normal");
							var box1 = doc.splitTextToSize('Se otorga este certificado a los profesionales que cumplan un mínimo de 90% de asistencia en las actividades programadas y que hayan obtenido un promedio de calificaciones entre diez (10) y catorce (14) puntos inclusive, en la escala de 01 a 20 puntos.', 7);
							doc.text(box1, 3, 12.8, {maxWidth: 6.9, align: "justify"});
							doc.setFontType("bold");
							doc.text(3, 16, 'Certificado de Aprobación:');
							doc.setFontType("normal");
							var box1_ = doc.splitTextToSize('Se otorga este certificado a los profesionales ', 7);
							doc.text(box1_, 3, 16.4, {maxWidth: 6.9, align: "justify"});
							var box2 = doc.splitTextToSize('en las actividades programadas y que hayan sido evaluados con un promedio mínimo de calificación de quince (15) puntos sin aproximación, en la escala de 01 a 20 puntos.', 7);
							doc.text(box2, 10.5, 12, {maxWidth: 6.9, align: "justify"});
							doc.setFontType("bold"); 
							doc.text(10.5, 14.3, 'Unidades Créditos:');
							doc.setFontType("normal"); 
							var box2_ = doc.splitTextToSize('Una (01) unidad crédito equivale a veinticuatro (24) horas de actividades teóricas prácticas, o de laboratorio.', 7);
							doc.text(box2_, 10.5, 14.8, {maxWidth: 6.9, align: "justify"});
							doc.setFontSize(12);
							doc.setFontType("bold");
							doc.text(18, 12, 'Reglamentación:');
							var box3 = doc.splitTextToSize('Esta actividad se realiza de acuerdo a lo establecido en el artículo 12 de la Normativa General de los Estudios de Postgrado del Consejo Nacional de Universidades, publicada en la Gaceta Oficial No 37328 del 20-11-2001 y el artículo 24 del Reglamento del Consejo de Estudios de Postgrado de la Universidad de Los Andes de fecha 06-02-1991.', 7.5);
							doc.setFontSize(11);
							doc.text(box3, 18, 12.5, {maxWidth: 7.3, align: "justify"});
							doc.save('certificado.pdf');
					});
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
