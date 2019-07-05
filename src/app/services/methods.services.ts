import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import { UserServices } from './user.services';

@Injectable()
export class MethodsServices {
	public identity;
	public token;
	public msgError;

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

	NumberLetters(number) {
		switch (number) {
			case 1:
				return 'UNO';
			case 2:
				return 'DOS';
			case 3:
				return 'TRES';
			case 4:
				return 'CUATRO';
			case 5:
				return 'CINCO';
			case 6:
				return 'SÉIS';
			case 7:
				return 'SIETE';
			case 8:
				return 'OCHO';
			case 9:
				return 'NUEVE';
			case 10:
				return 'DIEZ';
			case 11:
				return 'ONCE';
			case 12:
				return 'DOCE';
			case 13:
				return 'TRECE';
			case 14:
				return 'CATORCE';
			case 15:
				return 'QUINCE';
			case 16:
				return 'DIECISÉIS';
			case 17:
				return 'DIECISIETE';
			case 18:
				return 'DIECIOCHO';
			case 19:
				return 'DIECINUEVE';
			case 20:
				return 'VEINTE';
		};
	}

	errorAlert() {
		var promise = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve(false);
			}, 5000);
		  });
		return promise;
	}
}