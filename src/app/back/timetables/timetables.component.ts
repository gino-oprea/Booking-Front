import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { EntitiesService } from '../../app-services/entities.service';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { WorkingHours } from '../../objects/working-hours';
import { WorkingDay } from '../../objects/working-day';
import { CompanyService } from '../../app-services/company.service';

@Component({
  selector: 'bf-timetables',
  templateUrl: './timetables.component.html',
  styleUrls: ['./timetables.component.css']
})
export class TimetablesComponent extends BaseComponent implements OnInit
{
  customWorkingHours: WorkingHours[] = [];
  selectedWhId: number;
  selectedWorkingHours: WorkingHours;
  companyWorkingHours: WorkingHours;

  constructor(private injector: Injector,
    private entitiesService: EntitiesService,
    private companyService: CompanyService)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "Timetables";

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
    this.logAction(this.idCompany, false, Actions.View, '', '');

    this.loadCompanyWorkingHours();
    this.loadCustomWorkingHours(null);    
  }
  loadCompanyWorkingHours()
  {
    this.companyService.getCompanyWorkingHours(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load company working hours');
        this.companyWorkingHours = gro.objList[0];
        this.companyWorkingHours.id = 0;
        this.companyWorkingHours.name = 'Company working hours';        
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company working hours for entity', ''));

  }
  loadCustomWorkingHours(idWH: number)
  {
    this.entitiesService.getEntitiesWorkingHours(idWH).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load custom working hours');
        this.customWorkingHours = <WorkingHours[]>gro.objList;  
        this.selectedWhId = this.customWorkingHours[0].id;
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[0]);
      }
    });
  }
  onDdlChangeWH()
  {
    for (var i = 0; i < this.customWorkingHours.length; i++) 
    {
      if (this.customWorkingHours[i].id == this.selectedWhId)
      {
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
        break;
      }
    }
  }
  getWorkingHoursDeepCopy(workingHours: WorkingHours): WorkingHours
  {
    let newWH = new WorkingHours();

    newWH.id = workingHours.id;
    newWH.idParent = workingHours.idParent;
    newWH.name = workingHours.name;
    newWH.monday = new WorkingDay(workingHours.monday.workHours, workingHours.monday.date);
    newWH.tuesday = new WorkingDay(workingHours.tuesday.workHours, workingHours.tuesday.date);
    newWH.wednesday = new WorkingDay(workingHours.wednesday.workHours, workingHours.wednesday.date);
    newWH.thursday = new WorkingDay(workingHours.thursday.workHours, workingHours.thursday.date);
    newWH.friday = new WorkingDay(workingHours.friday.workHours, workingHours.friday.date);
    newWH.saturday = new WorkingDay(workingHours.saturday.workHours, workingHours.saturday.date);
    newWH.sunday = new WorkingDay(workingHours.sunday.workHours, workingHours.sunday.date);

    return newWH;
  }
}
