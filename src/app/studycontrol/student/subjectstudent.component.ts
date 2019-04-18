import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../security/users/user';
import { UserServices } from '../../services/user.services';
import { StudycontrolServices } from '../../services/studycontrol.services';
import * as CryptoJS from 'crypto-js';

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
    public tablebd;
    public subjectstudent

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserServices,
        private _studycontrolService: StudycontrolServices,
        private location: Location
    ) {
        this.title = 'Asignaturas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.tablebd = 'Lection-Student';

    }

    ngOnInit() {
        if (this.identity == null) {
            this._router.navigate(['/login']);
        } else {
            this._route.params.forEach((params: Params) => {
                var bytes = CryptoJS.AES.decrypt(params['id'], 'secret key 123');
                this.hash = params['id'];
                this.desc_hash = bytes.toString(CryptoJS.enc.Utf8);
                this._studycontrolService.getData(this.desc_hash, this.tablebd).subscribe(
                    (response: any) => {
                        this.subjectstudent = response.data;
                    },
                    error => {
                        console.log(<any>error)
                    }
                );
            });
        }
    }
}
