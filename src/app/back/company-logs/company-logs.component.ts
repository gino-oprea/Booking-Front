import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { LogItem } from '../../objects/log-item';

@Component({
  selector: 'bf-company-logs',
  templateUrl: './company-logs.component.html',
  styleUrls: ['./company-logs.component.css']
})
export class CompanyLogsComponent extends BaseComponent implements OnInit
{

  companyLogs: LogItem[] = [];

  constructor(private injector: Injector)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "CompanyLogs";

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
    this.loadLogs();
  }

  loadLogs()
  {
    this.loggerService.getCompanyLogs(this.idCompany).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
        this.companyLogs = <LogItem[]>gro.objList;
    });
  }

}
