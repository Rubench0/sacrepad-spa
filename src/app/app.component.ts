import { Component } from '@angular/core';
import { UserServices } from './services/user.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServices]
})
export class AppComponent {
  title = 'frontsacrepad';
  public identity;
  public token;

  constructor(
      private _userService: UserServices
  	) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
  }
  ngOnInit() {
  	//console.log(this.identity);
  }
}
