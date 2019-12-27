import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../app-services/client.service';
import { CompanyClient } from 'app/objects/company-client';
import { NonAuthGuard } from '../../route-guards/non-auth.guard';

@Component({
  selector: 'bf-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent extends BaseComponent implements OnInit
{
  clients: CompanyClient[] = [];
  displayLatestBookings = false;
  selectedPhone: string = null;

  constructor(private injector: Injector,
    private clientService: ClientService) 
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

    this.loadClients();
  }
  loadClients()
  {
    this.clientService.getCompanyClients(this.idCompany).subscribe(gro =>
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

}
