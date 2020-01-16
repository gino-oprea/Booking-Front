import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';
import { WebSites } from './enums/enums';
import { Token } from './objects/token';

@Component({
  selector: 'bf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit
{ 
  showTermsAndConditionsDiv: boolean = true;

  constructor(private injector: Injector)
  {
    super(injector, []);
    this.site = WebSites.Front;
    this.pageName = "Booking Front main parent page";

    this.loginService.loginSubject.subscribe(res =>
    { 
      this.setupAutoLogin();
    });
  }

  ngOnInit(): void
  {
    super.ngOnInit();    
    let savedUser = this.loginService.getCurrentUser();
    let savedToken = this.loginService.getToken();
    if (savedToken != null)
      if (this.getTokenRemainingTime(savedToken) < 0)
        if (savedUser != null)
          this.loginService.login(savedUser.email, savedUser.password, this);

    if (!this.autoLoginTimeout)
      this.setupAutoLogin();
  }
  
  setupAutoLogin()
  {
    let savedUser = this.loginService.getCurrentUser();
    let savedToken = this.loginService.getToken();

    if (savedToken != null)
    {
      if (!this.autoLoginTimeout)
        this.autoLoginTimeout = setTimeout(() =>
        {
          this.autoLogin();
        }, this.getTokenRemainingTime(savedToken));
    }        
  }  
}
