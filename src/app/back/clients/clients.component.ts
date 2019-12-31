import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions, UserRoleEnum } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../app-services/client.service';
import { CompanyClient } from 'app/objects/company-client';
import { NonAuthGuard } from '../../route-guards/non-auth.guard';
import { CompanyUsersService } from '../../app-services/company-users.service';
import { CompanyUser } from 'app/objects/user';

@Component({
  selector: 'bf-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent extends BaseComponent implements OnInit
{
  currentUserIsEmployee: boolean = false;
  idEntityLinkedToUser: number = null;

  clients: CompanyClient[] = [];
  displayLatestBookings = false;
  selectedPhone: string = null;

  constructor(private injector: Injector,
    private clientService: ClientService,
    private companyUsersService: CompanyUsersService) 
  {
    super(injector, []);
    this.site = WebSites.Back;
    this.pageName = "Clients";

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

    //this.loadClients();
    this.filterByUserRoleAndLoadClients();
  }
  loadClients()
  {
    this.clientService.getCompanyClients(this.idCompany, this.idEntityLinkedToUser).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.clients = <CompanyClient[]>gro.objList;
      }
    });
  }

  filterByUserRoleAndLoadClients()
  {
    let user = this.loginService.getCurrentUser();
    if (user)
      if (user.roles)
        if (user.roles.find(r => r.idRole == UserRoleEnum.Employee && r.idCompany == this.idCompany))
        {
          this.companyUsersService.getCompanyUsers(this.idCompany).subscribe(gro =>
          {
            if (gro.error != "")
              this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
            else
            {
              let companyUsers = <CompanyUser[]>gro.objList;

              let companyUserLoggedIn = companyUsers.find(cu => cu.id == user.id)
              if (companyUserLoggedIn)
              {
                this.idEntityLinkedToUser = companyUserLoggedIn.linkedIdEntity;
                if (this.idEntityLinkedToUser)
                  this.currentUserIsEmployee = true;
              }
            }

            this.loadClients();
          });
        }
        else
        {
          this.loadClients();
        }
  }

}
