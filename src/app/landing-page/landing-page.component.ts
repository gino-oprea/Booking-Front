import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites } from '../enums/enums';

@Component({
  selector: 'bf-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent extends BaseComponent implements OnInit {

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
