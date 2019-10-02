import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudycontrolServices } from 'src/app/services/studycontrol.services';
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-preinscription',
  templateUrl: './preinscription.component.html',
  styleUrls: ['./preinscription.component.css'],
  providers: [UserServices, StudycontrolServices]
})
export class PreinscriptionComponent implements OnInit {
  public title: string;
  public token;
  public identity;
  public cohorts;
  public cohort;
  public loading;
	public msgError;
  public msgSuccess;
  public status;
  public msg;

  constructor(
    private _router: Router,
    private _userService: UserServices,
    private _studycontrolService: StudycontrolServices,
  ) {
    this.title = 'Pre-Inscripción del aspirante';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    if (this.identity == null) {
      this._router.navigate(['/login']);
    } else {
      this._studycontrolService.get_selects('cohorts').subscribe(
        (response: any) => {
          this.cohorts = response.data;
        },
        error => {
          console.log(<any>error);
        }
      );
    }
  }

  errorAlert() {
		setTimeout(() => {
			this.msgError = false;
		}, 5000);
    }

  onSubmit() {
    this.loading = true;
    this._studycontrolService.preInscription(this.identity.id,this.cohort).subscribe(
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
			},
			error => {
				this.loading = false;
				this.msgError = true;
				this.msg = 'Error en el servidor, contacte al administrador.';
				this.errorAlert();
			}
		);
  }

  onBack() {
    this._router.navigate(['/studycontrol/cohorts/student']);
  }

}
