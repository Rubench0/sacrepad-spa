import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import { UserServices } from './user.services';

@Injectable()
export class MethodsServices {
	public identity;
	public token;

	constructor(
        private _route: ActivatedRoute,
		private _router: Router,
        private _userService: UserServices,
        private location: Location,
	) {

	}

	onBack() {
		this.location.back();
	}
}