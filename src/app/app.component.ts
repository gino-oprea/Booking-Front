import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';
import { WebSites } from './enums/enums';
import { Token } from './objects/token';

@Component({
  selector: 'bf-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends BaseComponent implements OnInit
{  
  title = 'bf works!';

  timeout;

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
    let savedUser = this.loginService.getCurrentUser();
    let savedToken = this.loginService.getToken();
    if (savedToken != null)
      if (this.getTokenRemainingTime(savedToken) < 0)
        if (savedUser != null)
          this.loginService.login(savedUser.email, savedUser.password, this);

    if (!this.timeout)
      this.setupAutoLogin();
  }
  
  setupAutoLogin()
  {
    let savedUser = this.loginService.getCurrentUser();
    let savedToken = this.loginService.getToken();

    if (savedToken != null)
    {
      if (!this.timeout)
        this.timeout = setTimeout(() =>
        {
          this.autoLogin();
        }, this.getTokenRemainingTime(savedToken));
    }
    // else
    //   if (savedUser != null)
    //   {
    //     this.autoLogin();
    //   }      
  }

  autoLogin()
  {
    console.log("auto login fired");
    clearTimeout(this.timeout);
    this.timeout = null;

    let savedUser = this.loginService.getCurrentUser();
    if (savedUser != null)
    {
      this.loginService.login(savedUser.email, savedUser.password, this).subscribe(token =>
      { 
        token.token_generated = new Date();

        this.timeout = setTimeout(() =>
        {          
          this.autoLogin();          
        }, this.getTokenRemainingTime(token));
      });      
    }
  }

  getTokenRemainingTime(token:Token): number
  {    
    // get current time
    let currentTime = new Date();
    var tokenStartTime = token.token_generated;

    let elapsed = currentTime.getTime() - tokenStartTime.getTime();
    let timeToRefresh = token.expires_in * 1000 - elapsed;

    var safetyInterval = 10 * 60 * 1000;//10 minute

    return timeToRefresh - safetyInterval;
  }
}
