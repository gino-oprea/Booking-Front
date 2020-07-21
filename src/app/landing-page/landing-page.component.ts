import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites } from '../enums/enums';

@Component({
  selector: 'bf-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent extends BaseComponent implements OnInit {


  public COMP_LOGO = require("../img/logo.png");
  public COMP_Banner = require("../img/home-banner.png");
  public COMP_Banner1 = require("../img/mobile-app.png");
  public APP_GooglePlay = require("../img/google-play.png");
  public APP_Store = require("../img/app-store.png");

D
  constructor(private injector: Injector) {
    super(injector, []);
    this.site = WebSites.Front;
    this.pageName = "Landing page";
  }

  ngOnInit()
  {
    super.ngOnInit();  
  }

  navigate()
  {
    this.router.navigate(['/searchcompany']);
  }
}
