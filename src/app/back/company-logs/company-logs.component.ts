import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { LogItem } from '../../objects/log-item';
import { CommonServiceMethods } from 'app/app-services/common-service-methods';

@Component({
  selector: 'bf-company-logs',
  templateUrl: './company-logs.component.html',
  styleUrls: ['./company-logs.component.css']
})
export class CompanyLogsComponent extends BaseComponent implements OnInit
{

  currentDate = new Date();
  startDate: Date = new Date(new Date().setDate(this.currentDate.getDate() - 7));
  endDate: Date = new Date(new Date().setDate(this.currentDate.getDate() + 1));
  en: any;

  companyLogs: LogItem[] = [];

  selectedIdSite: number = 0;
  selectedIdAction: number = 0;
  fiterEmail: string = '';
  filterPhone: string = '';
  filterPageName: string = '';

  constructor(private injector: Injector)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "CompanyLogs";

    this.en = {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
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
    this.loadLogs();
  }

  loadLogs()
  {
    let startDateString = CommonServiceMethods.getDateString(this.startDate);
    let endDateString = CommonServiceMethods.getDateString(this.endDate);

    this.loggerService.getCompanyLogs(this.idCompany, startDateString, endDateString,this.fiterEmail,this.filterPhone,this.selectedIdSite,this.filterPageName,this.selectedIdAction).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
        this.companyLogs = <LogItem[]>gro.objList;
    });
  }

}
