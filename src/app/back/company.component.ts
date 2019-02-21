import { ActivatedRoute } from '@angular/router';
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bf-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent extends BaseComponent implements OnInit
{  
  sidebarShow: boolean = false;
  
  constructor(private injector: Injector)
  {
    super(injector, []);
    this.site = WebSites.Back;
    this.pageName = "Company";
       
    this.routeSubscription = this.route.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
  }

  ngOnInit() 
  {
    this.logAction(this.idCompany, false, Actions.View, "", "");
  }
 
  toggleSideBar()
  {
    if (this.sidebarShow)
      this.sidebarShow = false;
    else
      this.sidebarShow = true;  
  }

}
