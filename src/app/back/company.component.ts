import { ActivatedRoute } from '@angular/router';
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions, UserRoleEnum } from '../enums/enums';
import { Subscription } from 'rxjs';
import { User } from 'app/objects/user';


@Component({
  selector: 'bf-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent extends BaseComponent implements OnInit
{
  sidebarShow: boolean = false;
  currentUser: User;

  constructor(private injector: Injector)
  {
    super(injector, [
      'lblDetails',
      'lblGeneralDetails',
      'lblLevels',
      'lblEntities',
      'lblTimetables',
      'lblLevelLinking',
      'lblBookings',
      'lblBookingsHistory',
      'lblClients',
      'lblUsers',
      'lblDashboard',
      'lblLogs'
    ]);
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
    super.ngOnInit();
    this.currentUser = this.loginService.getCurrentUser();
  }
  hasRolePermission(requiredRole: string): boolean
  {
    let role = this.currentUser.roles.find(r => r.idCompany == this.idCompany);
    if (role.idRole <= UserRoleEnum[requiredRole])
      return true;
    else
      return false;
  }

  toggleSideBar()
  {
    if (this.sidebarShow)
      this.sidebarShow = false;
    else
      this.sidebarShow = true;
  }

}
