import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';
import { WebSites } from './enums/enums';
import { Token } from './objects/token';
import { Location } from '@angular/common';

@Component({
  selector: 'bf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit
{
  showTermsAndConditionsDiv: boolean = true;
  iframe: boolean = true;
  isLanding: boolean = false;

  public APP_GooglePlay = require("./img/google-play.png");
  public APP_Store = require("./img/app-store.png");



  constructor(private injector: Injector, private location: Location)
  {
    super(injector, []);
    this.site = WebSites.Front;
    this.pageName = "Booking Front main parent page";

    // if (this.route.snapshot.url[0] == '/landing')
    //   this.isLanding = true;
    

    this.routeSubscription = this.route.queryParams.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('iframe'))
        this.iframe = params['iframe'].toString().toLowerCase() == 'true';
      else
        this.iframe = false;
    });

    this.location.onUrlChange((url, state) =>
    { 
      if (url == '/landing')
        this.isLanding = true;
      else
        this.isLanding = false;
    });
    

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
