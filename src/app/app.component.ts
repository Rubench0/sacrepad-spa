import { Component, HostListener } from '@angular/core';
import { UserServices } from './services/user.services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserServices]
})
export class AppComponent {
  public identity;
  public token;
  public expiryTime = 300;
  public timeLeft = 0;

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
    } else {
      const counttimer = timer(1000, 1000);
      counttimer.subscribe(val => {
        this.timeLeft = this.timeLeft + 1;
        console.log(this.timeLeft);
        if (this.timeLeft == this.expiryTime) {
          this._router.navigate(['/logout', 1]);
        }
        console.log(this.expiryTime);
      });
    }
  	//console.log(this.identity);
  }

  @HostListener('mousemove', ['$event.target'])
  @HostListener('keypress', ['$event.target'])
  onMouseMove() {
    this.timeLeft = 0;
  }
}
