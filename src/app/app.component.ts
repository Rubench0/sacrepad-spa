import { Component } from '@angular/core';
import { UserServices } from './services/user.services';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServices]
})
export class AppComponent {
  public identity;
  public token;

  constructor(
      private _userService: UserServices,
      private _route: ActivatedRoute,
		  private _router: Router,
  	) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }
  ngOnInit() {
    if (this.identity == null) {
			this._router.navigate(['/login']);
		}
  	//console.log(this.identity);
  }
}
