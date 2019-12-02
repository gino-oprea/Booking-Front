import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { EntitiesService } from '../../app-services/entities.service';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { WorkingHours } from '../../objects/working-hours';
import { WorkingDay } from '../../objects/working-day';
import { CompanyService } from '../../app-services/company.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Entity } from '../../objects/entity';

@Component({
  selector: 'bf-timetables',
  templateUrl: './timetables.component.html',
  styleUrls: ['./timetables.component.css']
})
export class TimetablesComponent extends BaseComponent implements OnInit
{
  customWorkingHours: WorkingHours[] = [];
  entities: Entity[] = [];
  selectedWhId: number;
  selectedWorkingHours: WorkingHours;
  originalWokingHours: WorkingHours;
  companyWorkingHours: WorkingHours;  
  isAddCustomWHMode = true;
  addCustomWHForm: FormGroup;

  displayDialogAddCustomWH = false;
  isSaveCustomWH = true;

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
    this.loadEntitiesAndCustomWorkingHours();
    this.initFormCustomWH();
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
  loadEntitiesAndCustomWorkingHours()
  {
    this.entitiesService.getEntities(null, null, this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load company entities');
        this.entities = gro.objList;    
        
        this.loadCustomWorkingHours(null);
      }
    });
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

        if (this.selectedWhId == null)
          // for (var i = 0; i < this.customWorkingHours.length; i++) 
          // {
          //   if (!this.isCustomWorkingHoursDisabled(this.customWorkingHours[i].id))
          //   {
              this.selectedWhId = this.customWorkingHours[0].id;
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[0]);
        this.originalWokingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[0]);
          //     break;
          //   }
          // }
      }
    });
  }
  // isCustomWorkingHoursDisabled(idWH:number):boolean
  // {
  //   let isDisabled: boolean = false;
  //   for (var i = 0; i < this.entities.length; i++)
  //   {
  //     if (this.entities[i].hasCustomWorkingHours && this.entities[i].idCustomWorkingHours == idWH)
  //     {
  //       isDisabled = true;
  //       break;
  //     }
  //   }
  //   return isDisabled;
  // }
  onDdlChangeWH()
  {
    for (var i = 0; i < this.customWorkingHours.length; i++) 
    {
      if (this.customWorkingHours[i].id == this.selectedWhId)
      {
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
        this.originalWokingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
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
  showAddEditCustomWHDialog(mode: boolean)
  {
    this.isAddCustomWHMode = mode;
    this.displayDialogAddCustomWH = true;
    this.initFormCustomWH();
  }
  initFormCustomWH()
  {
    this.addCustomWHForm = new FormGroup({
      'customWHName': new FormControl(this.isAddCustomWHMode ? '' : this.selectedWorkingHours.name, Validators.required)
    });
  }
  setCustomWHSubmitType(isSave: boolean)
  {
    this.isSaveCustomWH = isSave;
  }
  onAddEditCustomWH()
  {
    if (this.isSaveCustomWH)//save
    {
      if (this.isAddCustomWHMode)//add
      {
        this.companyWorkingHours.name = this.addCustomWHForm.controls['customWHName'].value;
        this.addEntityWorkingHours(this.companyWorkingHours);
      }
      else//edit
      {
        this.selectedWorkingHours.name = this.addCustomWHForm.controls['customWHName'].value;
        this.editEntityWorkingHours(this.selectedWorkingHours);
      }
    }
    else//delete
    {
      this.entitiesService.deleteEntityWorkingHours(this.selectedWhId).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
        }
        else
        {
          this.logAction(this.idCompany, false, Actions.Delete, '', 'delete custom working hours ', true, 'Custom working hours removed');
          this.selectedWhId = null;
          this.loadCustomWorkingHours(null);
        }
      },
        err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleting custom working hours', ''));
    }
    this.displayDialogAddCustomWH = false;
  }
  onUpdateWorkingHours(wh: WorkingHours)
  {
    this.entitiesService.validateWorkingHours(this.idCompany, wh).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.objList.length > 0)
      {
        this.logAction(this.idCompany, true, Actions.Edit, 'There are bookings affected by timetable changes', '', true, 'There are bookings affected by timetable changes', true);
        this.selectedWorkingHours = WorkingHours.DeepCopy(this.originalWokingHours);
      }
      else
      {
        this.selectedWorkingHours = wh;
        this.originalWokingHours = this.getWorkingHoursDeepCopy(wh);
        this.editEntityWorkingHours(wh);
      }
    });
  }
  editEntityWorkingHours(workingHours: WorkingHours)
  {
    this.entitiesService.editEntityWorkingHours(workingHours).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Edit, '', 'edit custom working hours', false, 'Saved');        
        this.loadCustomWorkingHours(null);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error editing entity custom hours', ''));
  }
  addEntityWorkingHours(workingHours: WorkingHours)
  {
    this.entitiesService.addEntityWorkingHours(workingHours).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'add custom working hours for idCompany:' + this.idCompany.toString());
        this.loadCustomWorkingHours(null);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding/editing entity custom hours', ''));
  }
}
