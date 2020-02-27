import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites } from 'app/enums/enums';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bf-company-security',
  templateUrl: './company-security.component.html',
  styleUrls: ['./company-security.component.css']
})
export class CompanySecurityComponent extends BaseComponent implements OnInit 
{
  tabs: any;
  triggerReloadRoles: boolean = false;

  constructor(private injector: Injector)
  { 
    super(injector, [
      'lblRoles',
      'lblUsers'
    ]);

    this.site = WebSites.Back;
    this.pageName = "CompanySecurity";

    this.tabs = {
      users: { active: true },
      roles: { active: false }
    };

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
  }

  ngOnInit()
  {
    super.ngOnInit();
  }

  selectTab(title: string)
  {
    this.tabs.users.active = false;
    this.tabs.roles.active = false;    

    if (title == 'users')
    {
      this.tabs.users.active = true;
    }
    if (title == 'roles')
    {
      this.tabs.roles.active = true;
    }    
  }

  onRoleChanged(event)
  {
    this.triggerReloadRoles = !this.triggerReloadRoles;
  }

}
