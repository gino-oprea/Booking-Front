import { FormArray } from '@angular/forms';
import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { Actions, DurationType, WebSites } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkingHours } from '../../objects/working-hours';
import { Entity } from '../../objects/entity';
import { LevelsService } from '../../app-services/levels.service';
import { EntitiesService } from '../../app-services/entities.service';
import { Level } from '../../objects/level';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { Image } from '../../objects/image';
import { CompanyService } from '../../app-services/company.service';
import { WorkingDay } from '../../objects/working-day';
import { SpecialDay } from '../../objects/special-day';
import { GenericDictionaryItem } from '../../objects/generic-dictionary-item';
import { CommonServiceMethods } from '../../app-services/common-service-methods';
import { ImageService } from '../../app-services/image.service';
import { Booking } from '../../objects/booking';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'bf-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css'],
})
export class EntitiesComponent extends BaseComponent implements OnInit 
{
  public COMP_IMG = require("./img/company.jpg");

  tabs: any;
  subTabs: any;

  displayDialogAddEntity = false;
  displayImageDialog = false;

  displayConfirmDeleteEntity = false;
  confirmDeleteEntityMessage: string = "Are you sure you want to delete this entity?";
  //displayDialogAddCustomWH = false;

  //isAddCustomWHMode = true;
  selectedImage: Image = null;
  genDetailsForm: FormGroup;
  addEntityForm: FormGroup;


  selectedLevel: Level;
  selectedEntity: Entity;
  selectedLevelId: number = null;
  selectedEntityId: number = null;
  selectedDateWorkingHours: Date;
  selectedWhId: number = 0;
  selectedWorkingHours: WorkingHours;
  images: Image[] = [];

  en: any;
  companyWorkingHours: WorkingHours;
  customWorkingHours: WorkingHours[] = [];
  variableWorkingHours: WorkingHours = null;
  levels: Level[] = [];
  entities: Entity[] = [];
  durationTypes: GenericDictionaryItem[] = [];
  durationArray: number[];
  isSave = true;
  isSaveCustomWH = true;
  isVariableWH = false;
  isCustomWH = false;

  displayAffectedBookings: boolean = false;
  affectedBookings: Booking[] = [];


  ////special days
  specialDays: any[] = [];
  calendarOptions: any;
  displayDialogSpecialDays = false;
  isRepeatEveryYear: boolean = false;
  selectedWeekDayIndex: number = -1;
  selectedDate: Date = null;
  selectedSpecialDay: SpecialDay = null;
  specialDayWorkingHours: WorkingHours;
  selectedSpecialDayWorkingHoursString: string = '';

  constructor(private injector: Injector,
    private companyService: CompanyService,
    private imageService: ImageService,
    private levelsService: LevelsService,
    private entitiesService: EntitiesService)
  {
    super(injector, [
      'lblSpecialDay',
      'lblSaved',
      'lblSave',
      'lblDelete',
      'lblRepeatEveryYear',
      'lblSelectedDayAlreadySpecial'
    ]);

    this.site = WebSites.Back;
    this.pageName = "Entities";

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
    this.route.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('idLevel'))
      {
        this.selectedLevelId = +params['idLevel'];
      }
      if (params.hasOwnProperty('idEntity'))
      {
        this.selectedEntityId = +params['idEntity'];
      }
    });

    this.calendarOptions = {
      left: '',
      center: 'title',
      right: 'today,prev,next'
    };

    this.tabs = {
      details: { active: true },
      timeSettings: { active: false }
    };
    this.subTabs = {
      workingHours: { active: true },
      specialDays: { active: false }
    };


    this.loadCustomWorkingHours(null, false);
    this.loadCompanyWorkingHours();
    this.loadLevels(this.selectedLevelId);
  }

  ngOnInit() 
  {
    super.ngOnInit();

    this.en = {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };

    this.selectedDateWorkingHours = new Date();

    this.initGenDetailsForm();
    this.initFormAddEntity();
    // this.initFormCustomWH();
  }
  loadDurationArray(type: DurationType)
  {
    this.durationArray = CommonServiceMethods.getDurationArray(type);
  }
  initFormAddEntity()
  {
    this.addEntityForm = new FormGroup({
      'addEntityName_RO': new FormControl('', Validators.required),
      'addEntityName_EN': new FormControl('', Validators.required)
    });
  }
  // initFormCustomWH()
  // {
  //   this.addCustomWHForm = new FormGroup({
  //     'customWHName': new FormControl(this.isAddCustomWHMode ? '' : this.selectedWorkingHours.name, Validators.required)
  //   });
  // }
  loadCustomWorkingHours(idWH: number, isAfterAutoAdd: boolean)
  {
    this.entitiesService.getEntitiesWorkingHours(this.idCompany, idWH).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load custom working hours');
        this.customWorkingHours = <WorkingHours[]>gro.objList;

        if (isAfterAutoAdd)
        {
          this.selectedWhId = this.customWorkingHours[0].id;
          this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[0]);
          this.selectedEntity.idCustomWorkingHours = this.customWorkingHours[0].id;
          this.selectedEntity.hasCustomWorkingHours = true;
          this.selectedEntity.hasVariableProgramme = false;
          this.editEntity(this.selectedEntity, false, false);
        }
      }
    });
  }
  loadLevels(levelId: number)
  {
    this.levelsService.getLevels(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load levels');
        this.levels = <Level[]>gro.objList;
        if (gro.objList.length > 0)
        {
          this.selectedLevelId = this.levels[0].id;
          if (levelId != null) this.selectedLevelId = levelId;
          this.selectedLevel = this.getLevel(this.selectedLevelId);
          this.loadEntities(this.selectedEntityId);
          this.loadDurationTypes();
        }
      }

    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting levels', ''));
  }
  loadEntityImages()
  {
    this.imageService.getEntityImages(this.selectedEntity.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.images = <Image[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities images', ''));
  }
  loadEntities(entityId: number)
  {
    this.entitiesService.getEntities(this.selectedLevelId, null).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load entities');
        this.entities = <Entity[]>gro.objList;
        if (gro.objList.length > 0)
        {
          this.selectedEntityId = this.entities[0].id;
          if (entityId != null) this.selectedEntityId = entityId;
          this.selectedEntity = this.getEntity(this.selectedEntityId);
          this.loadEntityImages();
          this.isCustomWH = this.selectedEntity.hasCustomWorkingHours;
          this.isVariableWH = this.selectedEntity.hasVariableProgramme;

          if (this.isCustomWH)//daca e custom
          {
            this.selectedWhId = this.selectedEntity.idCustomWorkingHours;

            for (var i = 0; i < this.customWorkingHours.length; i++) 
            {
              if (this.selectedWhId == this.customWorkingHours[i].id)
              {
                this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
                break;
              }
            }
          }
          if (this.isVariableWH)//daca e variable
          {
            let weekStartEnd = this.getWeekStartEndDates(this.selectedDateWorkingHours);
            this.loadEntityVariableWorkingHours(this.selectedEntityId, weekStartEnd[0], weekStartEnd[1], true);
          }
          if (!this.isCustomWH && !this.isVariableWH)//daca nu e nici custom nici variable
          {
            this.selectedWhId = 0;
            this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.companyWorkingHours);
          }
          this.initGenDetailsForm();

          this.loadEntitySpecialDays();
        }
      }

    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities', ''));
  }
  loadDurationTypes()
  {
    this.entitiesService.getDurationTypes().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.durationTypes = <GenericDictionaryItem[]>gro.objList;
        for (var i = this.durationTypes.length - 1; i >= 0; i--) 
        {
          if (!this.checkDurationType(this.durationTypes[i].id))
            this.durationTypes.splice(i, 1);
        }
        this.loadDurationArray(<DurationType>parseInt(this.genDetailsForm.controls["duration_type"].value));
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting duration types', ''));
  }
  loadEntityVariableWorkingHours(entityId: number, dateStart: Date, dateEnd: Date, setAsSelected: boolean)
  {
    this.entitiesService.getEntityVariableWorkingHours(entityId, dateStart, dateEnd).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'get entity variable working hours idEntity: ' + entityId.toString());
        if (gro.objList.length > 0)
        {
          this.selectedWhId = -1;
          this.variableWorkingHours = <WorkingHours>gro.objList[0];
        }
        else
        {
          this.selectedWhId = -1;
          this.variableWorkingHours = this.getEmptyWorkingHours();//this.companyWorkingHours;          
        }
        if (setAsSelected)
        {
          this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.variableWorkingHours);
          this.selectedWhId = this.doCustomWorkingHoursIdentification();
        }
        this.assignCalendarDateForWorkingHours();
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entity variable working hours idEntity: ' + entityId.toString(), ''));
  }
  getEmptyWorkingHours(): WorkingHours
  {
    var emptyWorkingDay = new WorkingDay("", null);
    var emptyWorkingHours = new WorkingHours(null, null, null,
      emptyWorkingDay,
      emptyWorkingDay,
      emptyWorkingDay,
      emptyWorkingDay,
      emptyWorkingDay,
      emptyWorkingDay,
      emptyWorkingDay);

    return emptyWorkingHours;
  }

  getEntity(id: number): Entity
  {
    for (var i = 0; i < this.entities.length; i++) 
    {
      if (this.entities[i].id == id)
        return this.entities[i];
    }
    this.router.navigate(['/company', this.idCompany.toString(), 'entities']);
  }
  getLevel(id: number): Level
  {
    for (var i = 0; i < this.levels.length; i++) 
    {
      if (this.levels[i].id == id)
        return this.levels[i];
    }
    this.router.navigate(['/company', this.idCompany.toString(), 'entities']);
  }
  initGenDetailsForm()
  {
    let name_ro = '';
    let name_en = '';
    let descr_ro = '';
    let descr_en = '';
    let duration = null;
    let idDurationType = 1;
    let price = null;
    let maxBookings = null;
    let characteristics = new FormArray([]);


    if (this.selectedEntity != null)
    {
      name_ro = this.selectedEntity.entityName_RO;
      name_en = this.selectedEntity.entityName_EN;
      descr_ro = this.selectedEntity.entityDescription_RO;
      descr_en = this.selectedEntity.entityDescription_EN;
      duration = this.selectedEntity.defaultServiceDuration;
      idDurationType = this.selectedEntity.idDurationType;
      price = this.selectedEntity.defaultServicePrice;
      maxBookings = this.selectedEntity.maximumMultipleBookings;
      if (this.selectedEntity.characteristics != null)
      {
        for (var i = 0; i < this.selectedEntity.characteristics.length; i++) 
        {
          var element = this.selectedEntity.characteristics[i];
          characteristics.push(new FormGroup({
            'characteristic_value_en': new FormControl(element.textValue_EN),
            'characteristic_value_ro': new FormControl(element.textValue_RO),
            'characteristic_numeric_value': new FormControl(element.numericValue)
          }));
        }
      }
    }

    this.genDetailsForm = new FormGroup({
      'name_ro': new FormControl(name_ro, Validators.required),
      'name_en': new FormControl(name_en, Validators.required),
      'description_ro': new FormControl(descr_ro),
      'description_en': new FormControl(descr_en),
      'duration': new FormControl(duration),
      'duration_type': new FormControl(idDurationType),
      'price': new FormControl(price),
      'max_bookings': new FormControl(maxBookings),
      'characteristics': characteristics
    });

    this.loadDurationArray(<DurationType>parseInt(this.genDetailsForm.controls["duration_type"].value));

    this.setDurationControlsState();
  }
  setDurationControlsState()
  {
    if (this.selectedEntity != null)
      this.entitiesService.getEntityBookings(this.selectedEntity.id).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (result.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
        }
        else
        {
          if (gro.objList.length > 0)
          {
            this.genDetailsForm.controls['duration'].disable();
            this.genDetailsForm.controls['duration_type'].disable();
          }
          else
          {
            this.genDetailsForm.controls['duration'].enable();
            this.genDetailsForm.controls['duration_type'].enable();
          }
        }
      });
  }
  checkDurationType(idDurationType): boolean
  {
    if (this.selectedLevel != null)
    {
      if (idDurationType == DurationType.Days)
      {
        if (this.selectedLevel.idDurationType != DurationType.Days)
          return false;
        else
          return true;
      }
      else
      {
        if (this.selectedLevel.idDurationType == DurationType.Days)
          return false;
        else
          return true;
      }
    }
  }
  setEntitySubmitType(isSave: boolean)
  {
    this.isSave = isSave;
  }
  // setCustomWHSubmitType(isSave: boolean)
  // {
  //   this.isSaveCustomWH = isSave;
  // }
  onSaveGenDetailsForm()
  {
    if (this.isSave)//daca e save
    {
      try 
      {
        this.selectedEntity.entityName_RO = this.genDetailsForm.controls['name_ro'].value;
        this.selectedEntity.entityName_EN = this.genDetailsForm.controls['name_en'].value;
        this.selectedEntity.entityDescription_RO = this.genDetailsForm.controls['description_ro'].value;
        this.selectedEntity.entityDescription_EN = this.genDetailsForm.controls['description_en'].value;
        this.selectedEntity.defaultServiceDuration = parseInt(this.genDetailsForm.controls['duration'].value);
        this.selectedEntity.idDurationType = parseInt(this.genDetailsForm.controls['duration_type'].value);
        this.selectedEntity.defaultServicePrice = parseInt(this.genDetailsForm.controls['price'].value);
        this.selectedEntity.maximumMultipleBookings = parseInt(this.genDetailsForm.controls['max_bookings'].value);

        if ((<FormArray>this.genDetailsForm.get('characteristics')).controls.length > 0)
        {
          for (var i = 0; i < this.selectedEntity.characteristics.length; i++) 
          {
            this.selectedEntity.characteristics[i].textValue_RO = (<FormGroup>(<FormArray>this.genDetailsForm.get('characteristics')).controls[i]).controls['characteristic_value_ro'].value;
            this.selectedEntity.characteristics[i].textValue_EN = (<FormGroup>(<FormArray>this.genDetailsForm.get('characteristics')).controls[i]).controls['characteristic_value_en'].value;
            this.selectedEntity.characteristics[i].numericValue = parseInt((<FormGroup>(<FormArray>this.genDetailsForm.get('characteristics')).controls[i]).controls['characteristic_numeric_value'].value);
          }
        }
        this.editEntity(this.selectedEntity, true, true);
      }
      catch (ex)
      {
        this.logAction(this.idCompany, true, Actions.Edit, ex.message, 'error editing entity');
        this.showPageMessage('error', 'Error', ex.message);
      }
    }
    else//daca e delete
    {
      //this.deleteEntity(this.selectedEntity);
      this.showConfirmDeleteDialog()
    }
  }
  showConfirmDeleteDialog()
  {
    this.displayConfirmDeleteEntity = true;
    this.confirmDeleteEntityMessage = "Are you sure you want to delete entity: " + this.selectedEntity.entityDescription_EN;
  }
  onConfirmDelete(message: string)
  {
    if (message == "yes")
      this.deleteEntity(this.selectedEntity);

    this.displayConfirmDeleteEntity = false;
  }
  onUpload(fileInput: any)
  {
    if (this.images.length < 5)
    {
      let fi = fileInput.target;
      if (fi.files && fi.files[0])
      {
        let fileToUpload = fi.files[0];
        this.imageService.uploadEntityImage(this.selectedEntity.id, fileToUpload).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            if (gro.error.indexOf('size limit') > -1)
              this.showPageMessage('error', 'Error', 'size limit exceded');
            else
              //this.showPageMessage('error', 'Error', gro.error);

              this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Edit, '', 'image upload for entity ' + this.selectedEntity.id, true, 'image saved');
            //this.showPageMessage('success', 'Success', 'image saved');
            this.loadEntities(this.selectedEntity.id);
          }
        });
      }
    }
    else
    {
      this.showPageMessage('warn', 'Warning', 'only 5 images permitted');
    }
  }

  onImageClick(image: Image)
  {
    this.selectedImage = image;
    this.displayImageDialog = true;
  }
  deleteImage()
  {
    this.imageService.deleteEntityImage(this.selectedImage.id, this.selectedEntity.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;

      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'delete entity image ' + this.selectedEntity.id, true, 'image deleted');
        //this.showPageMessage('success', 'Success', '');
        this.loadEntities(this.selectedEntity.id);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleting entity image', ''));

    this.displayImageDialog = false;
  }
  selectTab(title: string)
  {
    if (title == 'details')
    {
      this.tabs.details.active = true;
      this.tabs.timeSettings.active = false;
    }
    if (title == 'timeSettings')
    {
      this.tabs.details.active = false;
      this.tabs.timeSettings.active = true;
    }
  }
  selectSubTab(title: string)
  {
    if (title == 'workingHours')
    {
      this.subTabs.workingHours.active = true;
      this.subTabs.specialDays.active = false;
    }
    if (title == 'specialDays')
    {
      this.subTabs.workingHours.active = false;
      this.subTabs.specialDays.active = true;
    }
  }
  onDdlChangeLevel()
  {
    this.selectedLevel = this.getLevel(this.selectedLevelId);
    this.loadEntities(null);
    this.loadDurationTypes();
  }
  onDdlChangeEntity()
  {
    this.selectedEntity = this.getEntity(this.selectedEntityId);
    this.loadEntityImages();
    this.initGenDetailsForm();

    this.isCustomWH = this.selectedEntity.hasCustomWorkingHours;
    this.isVariableWH = this.selectedEntity.hasVariableProgramme;
    if (this.isCustomWH)
    {
      this.selectedWhId = this.selectedEntity.idCustomWorkingHours;
      for (var i = 0; i < this.customWorkingHours.length; i++) 
      {
        if (this.selectedWhId == this.customWorkingHours[i].id)
        {
          this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
          break;
        }
      }
    }
    if (this.isVariableWH)
    {
      let weekStartEnd = this.getWeekStartEndDates(this.selectedDateWorkingHours);
      this.loadEntityVariableWorkingHours(this.selectedEntityId, weekStartEnd[0], weekStartEnd[1], true);
    }
    if (!this.isCustomWH && !this.isVariableWH)
    {
      this.selectedWhId = 0;
      this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.companyWorkingHours);
    }

    this.loadEntitySpecialDays();
  }
  onDdlChangeWH()
  {
    if (this.isCustomWH || (!this.isCustomWH && !this.isVariableWH))//daca e in modul custom sau nici una nici alta
    {
      if (this.selectedWhId == 0)//company wh
      {
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.companyWorkingHours);

        this.isCustomWH = false;
        this.selectedEntity.hasCustomWorkingHours = false;
        this.selectedEntity.workingHours = this.getWorkingHoursDeepCopy(this.selectedWorkingHours);
        this.editEntity(this.selectedEntity, false, false);
      }
      else//custom wh
      {
        for (var i = 0; i < this.customWorkingHours.length; i++) 
        {
          if (this.customWorkingHours[i].id == this.selectedWhId)
          {
            this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
            break;
          }
        }
        this.isCustomWH = true;
        this.selectedEntity.hasCustomWorkingHours = true;
        this.selectedEntity.idCustomWorkingHours = parseInt(this.selectedWhId.toString());
        this.selectedEntity.workingHours = this.getWorkingHoursDeepCopy(this.selectedWorkingHours);
        this.editEntity(this.selectedEntity, false, false);
      }

      this.entitiesService.validateWorkingHours(this.idCompany, this.selectedWorkingHours, this.selectedEntityId).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.objList.length > 0)
        {
          this.logAction(this.idCompany, true, Actions.Edit, 'There are bookings affected by timetable changes', '', true, 'There are bookings affected by timetable changes', true);
          this.loadLevels(this.selectedLevelId);

          this.affectedBookings = gro.objList;
          this.displayAffectedBookings = true;
        }
      });
    }
    if (this.isVariableWH) //daca e in modul variabil
    {
      //selectam wh corespunzator
      if (this.selectedWhId == 0)//company wh
      {
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.companyWorkingHours);
      }
      else
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
      this.assignCalendarDateForWorkingHours();
      //il salvam in tabela de wh variabile
      let wds: WorkingDay[] = [];
      wds.push(this.selectedWorkingHours.monday);
      wds.push(this.selectedWorkingHours.tuesday);
      wds.push(this.selectedWorkingHours.wednesday);
      wds.push(this.selectedWorkingHours.thursday);
      wds.push(this.selectedWorkingHours.friday);
      wds.push(this.selectedWorkingHours.saturday);
      wds.push(this.selectedWorkingHours.sunday);

      this.addEntityVariableWorkingHours(wds);


      this.entitiesService.validateWorkingHours(this.idCompany, this.selectedWorkingHours, this.selectedEntityId).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.objList.length > 0)
        {
          this.logAction(this.idCompany, true, Actions.Edit, 'There are bookings affected by timetable changes', '', true, 'There are bookings affected by timetable changes', true);
          this.loadLevels(this.selectedLevelId);

          this.affectedBookings = gro.objList;
          this.displayAffectedBookings = true;
        }
      });
    }
  }
  onIsCustomChange()
  {
    if (this.isCustomWH)
    {
      this.isVariableWH = false;
      this.assignCalendarDateForWorkingHours();
      if (this.customWorkingHours.length == 0)//trebuie adaugat
      {
        this.companyWorkingHours.name = 'Custom';
        this.addEntityWorkingHours(this.idCompany, this.companyWorkingHours, true);
      }
      else//trebuie selectat primul existent(adica company working hours)
      {
        if (this.selectedEntity.idCustomWorkingHours == null)
        {
          this.selectedWhId = this.customWorkingHours[0].id;
          this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[0]);
        }
        else
        {
          this.selectedWhId = this.selectedEntity.idCustomWorkingHours;
          for (var i = 0; i < this.customWorkingHours.length; i++) 
          {
            if (this.customWorkingHours[i].id == this.selectedWhId)
            {
              this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.customWorkingHours[i]);
              break;
            }
          }
        }

        this.selectedEntity.workingHours = this.getWorkingHoursDeepCopy(this.selectedWorkingHours);
        this.selectedEntity.idCustomWorkingHours = this.selectedWhId;
        this.selectedEntity.hasCustomWorkingHours = true;
        this.selectedEntity.hasVariableProgramme = false;
        this.editEntity(this.selectedEntity, false, false);
      }
    }
    else//trebuie selectate orele companiei id=0
    {
      this.selectedWhId = 0;
      this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.companyWorkingHours);
      this.selectedEntity.workingHours = this.getWorkingHoursDeepCopy(this.selectedWorkingHours);
      this.selectedEntity.hasCustomWorkingHours = false;
      this.editEntity(this.selectedEntity, false, false);
    }

    this.entitiesService.validateWorkingHours(this.idCompany, this.selectedWorkingHours, this.selectedEntityId).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.objList.length > 0)
      {
        this.logAction(this.idCompany, true, Actions.Edit, 'There are bookings affected by timetable changes', '', true, 'There are bookings affected by timetable changes', true);
        this.loadLevels(this.selectedLevelId);

        this.affectedBookings = gro.objList;
        this.displayAffectedBookings = true;
      }
    });
  }
  onIsVariableChange()
  {
    if (this.isVariableWH)
    {
      this.isCustomWH = false;
      this.assignCalendarDateForWorkingHours();

      this.loadEntityVariableWorkingHours(this.selectedEntityId, this.selectedWorkingHours.monday.date, this.selectedWorkingHours.sunday.date, true);

      this.selectedEntity.hasCustomWorkingHours = false;
      this.selectedEntity.hasVariableProgramme = true;
      this.selectedEntity.workingHours = this.getWorkingHoursDeepCopy(this.selectedWorkingHours);
      this.editEntity(this.selectedEntity, false, false);
    }
    else
    {
      this.assignCalendarDateForWorkingHours();
      this.selectedEntity.hasVariableProgramme = false;
      this.onIsCustomChange();//salvarea in db a entitiatii se face aici        
    }

    this.entitiesService.validateWorkingHours(this.idCompany, this.selectedWorkingHours, this.selectedEntityId).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.objList.length > 0)
      {
        this.logAction(this.idCompany, true, Actions.Edit, 'There are bookings affected by timetable changes', '', true, 'There are bookings affected by timetable changes', true);
        this.loadLevels(this.selectedLevelId);

        this.affectedBookings = gro.objList;
        this.displayAffectedBookings = true;
      }
    });
  }
  getWeekStartEndDates(date: Date): Date[]
  {
    let weekDay = date.getDay();

    let mondayDate = new Date(date);
    let sundayDate = new Date(date);

    if (weekDay != 0)//nu duminica
    {
      mondayDate.setDate(mondayDate.getDate() + (1 - weekDay));
      sundayDate.setDate(sundayDate.getDate() + (7 - weekDay));
    }
    else//duminica
    {
      mondayDate.setDate(mondayDate.getDate() - 6);
      sundayDate.setDate(sundayDate.getDate());
    }

    let weekStartEnd = [];
    weekStartEnd.push(mondayDate);
    weekStartEnd.push(sundayDate);

    return weekStartEnd;
  }

  assignCalendarDateForWorkingHours()
  {
    if (this.isVariableWH)
    {
      let weekDay = this.selectedDateWorkingHours.getDay();

      //trebuie creata data cu timezone-ul clientului pentru a evita conversia la UTC cand se trimite la baza de date (JSON.stringify)      
      var _userOffset = this.selectedDateWorkingHours.getTimezoneOffset() * 60000; // [min*60000 = ms]

      let mondayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));
      let tuesdayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));
      let wednesdayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));
      let thursdayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));
      let fridayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));
      let saturdayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));
      let sundayDate = new Date(this.selectedDateWorkingHours.getTime() + this.invertNumberSign(_userOffset));

      if (weekDay != 0)//nu duminica
      {
        mondayDate.setDate(mondayDate.getDate() + (1 - weekDay));
        tuesdayDate.setDate(tuesdayDate.getDate() + (2 - weekDay));
        wednesdayDate.setDate(wednesdayDate.getDate() + (3 - weekDay));
        thursdayDate.setDate(thursdayDate.getDate() + (4 - weekDay));
        fridayDate.setDate(fridayDate.getDate() + (5 - weekDay));
        saturdayDate.setDate(saturdayDate.getDate() + (6 - weekDay));
        sundayDate.setDate(sundayDate.getDate() + (7 - weekDay));
      }
      else//duminica
      {
        mondayDate.setDate(mondayDate.getDate() - 6);
        tuesdayDate.setDate(tuesdayDate.getDate() - 5);
        wednesdayDate.setDate(wednesdayDate.getDate() - 4);
        thursdayDate.setDate(thursdayDate.getDate() - 3);
        fridayDate.setDate(fridayDate.getDate() - 2);
        saturdayDate.setDate(saturdayDate.getDate() - 1);
        sundayDate.setDate(sundayDate.getDate());
      }

      this.selectedWorkingHours.monday.date = mondayDate;
      this.selectedWorkingHours.tuesday.date = tuesdayDate;
      this.selectedWorkingHours.wednesday.date = wednesdayDate;
      this.selectedWorkingHours.thursday.date = thursdayDate;
      this.selectedWorkingHours.friday.date = fridayDate;
      this.selectedWorkingHours.saturday.date = saturdayDate;
      this.selectedWorkingHours.sunday.date = sundayDate;
    }
    else
    {
      this.selectedWorkingHours.monday.date = null;
      this.selectedWorkingHours.tuesday.date = null;
      this.selectedWorkingHours.wednesday.date = null;
      this.selectedWorkingHours.thursday.date = null;
      this.selectedWorkingHours.friday.date = null;
      this.selectedWorkingHours.saturday.date = null;
      this.selectedWorkingHours.sunday.date = null;
    }

    ////schimbam referinta la obiect ca sa se declanseze change detection-ul in componenta working-hours
    //let auxWh = Object.assign({}, this.selectedWorkingHours);
    this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.selectedWorkingHours);// auxWh;    
  }
  showAddEntityDialog()
  {
    this.displayDialogAddEntity = true;
  }
  onAddEntityForm()
  {
    let newEntity = new Entity();
    newEntity.idLevel = parseInt(this.selectedLevelId.toString());
    newEntity.entityName_RO = this.addEntityForm.controls["addEntityName_RO"].value;
    newEntity.entityName_EN = this.addEntityForm.controls["addEntityName_EN"].value;

    this.entitiesService.addEntity(newEntity).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'add entity', true, 'Entity added');
        //one time subscription - trebuie facut reload la entities abia dupa ce se emite noul token cu claim-urile corecte
        this.loginService.loginSubject.pipe(first()).subscribe(login =>
        {
          this.loadEntities(null);
        });

        this.autoLogin();//mai sus e pregatit subscriptionul ca sa prinda schimbarea de token si sa faca refresh la entitati        
      }
    },
      err =>
      {
        this.logAction(this.idCompany, true, Actions.Add, 'http error adding entity', err.status + ' ' + err.statusText);
        this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
      });

    this.displayDialogAddEntity = false;
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

        this.selectedWhId = 0;
        this.selectedWorkingHours = this.getWorkingHoursDeepCopy(this.companyWorkingHours);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company working hours for entity', ''));

  }
  onUpdateWorkingHours(wh: WorkingHours)
  {
    //doar pentru modul variabil
    let wds: WorkingDay[] = [];
    wds.push(this.selectedWorkingHours.monday);
    wds.push(this.selectedWorkingHours.tuesday);
    wds.push(this.selectedWorkingHours.wednesday);
    wds.push(this.selectedWorkingHours.thursday);
    wds.push(this.selectedWorkingHours.friday);
    wds.push(this.selectedWorkingHours.saturday);
    wds.push(this.selectedWorkingHours.sunday);

    this.addEntityVariableWorkingHours(wds);

    this.selectedWhId = this.doCustomWorkingHoursIdentification();

    this.entitiesService.validateWorkingHours(this.idCompany, this.selectedWorkingHours, this.selectedEntityId).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.objList.length > 0)
      {
        this.logAction(this.idCompany, true, Actions.Edit, 'There are bookings affected by timetable changes', '', true, 'There are bookings affected by timetable changes', true);
        this.loadLevels(this.selectedLevelId);

        this.affectedBookings = gro.objList;
        this.displayAffectedBookings = true;
      }
    });
  }
  onSelectedDateChange()
  {
    let weekStartEnd = this.getWeekStartEndDates(this.selectedDateWorkingHours);
    this.loadEntityVariableWorkingHours(this.selectedEntityId, weekStartEnd[0], weekStartEnd[1], true);
  }
  editEntity(entity: Entity, isReloadEntities: boolean, showSuccessMessage: boolean)
  {
    this.entitiesService.editEntity(entity).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Edit, '', 'edit entity idEntity:' + entity.id.toString(), showSuccessMessage, 'Entity saved');
        if (isReloadEntities)
          this.loadEntities(entity.id);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error editing entity', ''));
  }
  deleteEntity(entity: Entity)
  {
    this.entitiesService.deleteEntity(entity.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);

        if (gro.objList != null && gro.objList.length > 0)
        {
          this.affectedBookings = gro.objList;
          this.displayAffectedBookings = true;
        }
      }
      else
      {
        //this.showPageMessage('success', 'Success', 'Entity deleted');
        this.logAction(this.idCompany, false, Actions.Delete, '', 'delete entity ' + this.selectedEntityId, true, 'Entity deleted');
      }
      this.loadEntities(null);
    });
  }
  addEntityWorkingHours(idCompany: number, workingHours: WorkingHours, isAfterAutoAdd: boolean)
  {
    this.entitiesService.addEntityWorkingHours(idCompany, workingHours).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'add entity working hours idEntity:' + this.selectedEntityId.toString());
        this.loadCustomWorkingHours(null, isAfterAutoAdd);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding/editing entity custom hours', ''));
  }
  addEntityVariableWorkingHours(wds: WorkingDay[])
  {
    this.entitiesService.addEntityVariableWorkingHours(wds, this.selectedEntityId).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'Added entity variable working hours');
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding entity variable working hours idEntity: ' + this.selectedEntityId.toString(), ''));
  }
  doCustomWorkingHoursIdentification(): number
  {
    let matchId = -1;
    for (var i = 0; i < this.customWorkingHours.length; i++) 
    {
      if (this.selectedWorkingHours.monday.workHours == this.customWorkingHours[i].monday.workHours
        && this.selectedWorkingHours.tuesday.workHours == this.customWorkingHours[i].tuesday.workHours
        && this.selectedWorkingHours.wednesday.workHours == this.customWorkingHours[i].wednesday.workHours
        && this.selectedWorkingHours.thursday.workHours == this.customWorkingHours[i].thursday.workHours
        && this.selectedWorkingHours.friday.workHours == this.customWorkingHours[i].friday.workHours
        && this.selectedWorkingHours.saturday.workHours == this.customWorkingHours[i].saturday.workHours
        && this.selectedWorkingHours.sunday.workHours == this.customWorkingHours[i].sunday.workHours)
      {
        this.selectedWorkingHours.id = this.customWorkingHours[i].id;
        this.selectedWorkingHours.name = this.customWorkingHours[i].name;
        matchId = this.customWorkingHours[i].id;
        break;
      }
    }

    if (this.selectedWorkingHours.monday.workHours == this.companyWorkingHours.monday.workHours
      && this.selectedWorkingHours.tuesday.workHours == this.companyWorkingHours.tuesday.workHours
      && this.selectedWorkingHours.wednesday.workHours == this.companyWorkingHours.wednesday.workHours
      && this.selectedWorkingHours.thursday.workHours == this.companyWorkingHours.thursday.workHours
      && this.selectedWorkingHours.friday.workHours == this.companyWorkingHours.friday.workHours
      && this.selectedWorkingHours.saturday.workHours == this.companyWorkingHours.saturday.workHours
      && this.selectedWorkingHours.sunday.workHours == this.companyWorkingHours.sunday.workHours)
    {
      matchId = 0;
    }
    return matchId;
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
  invertNumberSign(n: number): number
  {
    let inverted: number;
    if (n != 0)
      inverted = -n;
    else
      inverted = n;

    return inverted;
  }



  //////special days methods
  loadEntitySpecialDays()
  {
    this.specialDays = [];
    this.entitiesService.getEntitySpecialDays(this.selectedEntityId, null).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
        for (var i = 0; i < sd.length; i++) 
        {
          this.specialDays.push({
            "id": sd[i].id.toString(),
            "title": this.getCurrentLabelValue('lblSpecialDay'),
            "allDay": true,
            "start": sd[i].day,
            "color": "#ff4d4d"
          });
          if (sd[i].isEveryYear)
          {
            for (var j = -50; j < 51; j++) 
            {
              if (j != 0)//sarim peste data curenta care este deja adaugata
              {
                let reccruringDate = new Date(sd[i].day);
                let year = reccruringDate.getFullYear();
                reccruringDate.setFullYear(year + j);

                this.specialDays.push({
                  "id": sd[i].id.toString(),
                  "title": this.getCurrentLabelValue('lblSpecialDay'),
                  "allDay": true,
                  "start": reccruringDate,
                  "color": "#ff4d4d"
                });
              }
            }
          }
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entity special days', ''));
  }
  onDayClick(event) 
  {
    this.selectedDate = event;//.date._d;
    this.selectedWeekDayIndex = this.convertWeekDayIndex(event.getDay());//.date._d.getDay());
    this.displayDialogSpecialDays = true;

    this.getExistingSpecialDayEvent(event);//.date._d);
  }
  onEventClick(event)
  {
    this.selectedDate = new Date(event.start);//.calEvent._start._d;
    this.selectedWeekDayIndex = this.convertWeekDayIndex(new Date(event.start).getDay());//.calEvent._start._d.getDay());
    this.displayDialogSpecialDays = true;

    this.getExistingSpecialDayEvent(new Date(event.start));//.calEvent._start._d);
  }
  onEventDrop(event)
  {
    //trebuie verificat daca nu exista deja special day la noua data si atunci nu schimbam nimic si afisam mesaj
    //trebuie facuta optiune de remove special day
    this.entitiesService.getEntitySpecialDays(this.selectedEntityId, new Date(event.event.start)).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
        if (sd.length > 0)
        {
          this.showPageMessage('warn', 'Warning', this.getCurrentLabelValue('lblSelectedDayAlreadySpecial'));
          this.loadEntitySpecialDays();
        }
        else
        {
          this.updateSpecialDayAfterDrop(new Date(event.originDate), new Date(event.targetDate));
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entity special days', ''));
  }
  getExistingSpecialDayEvent(date: Date)
  {
    this.entitiesService.getEntitySpecialDays(this.selectedEntityId, date).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
        if (sd.length > 0)
        {
          this.selectedSpecialDay = sd[0];
          this.selectedSpecialDayWorkingHoursString = sd[0].workingHours;
          this.isRepeatEveryYear = sd[0].isEveryYear;

          this.specialDayWorkingHours = new WorkingHours(0, this.idCompany, '',
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null));
          if (this.selectedWeekDayIndex == 0) { this.specialDayWorkingHours.monday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 1) { this.specialDayWorkingHours.tuesday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 2) { this.specialDayWorkingHours.wednesday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 3) { this.specialDayWorkingHours.thursday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 4) { this.specialDayWorkingHours.friday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 5) { this.specialDayWorkingHours.saturday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 6) { this.specialDayWorkingHours.sunday.workHours = this.selectedSpecialDay.workingHours; }
        }
        else
        {
          //resetam toate variabilele
          this.isRepeatEveryYear = false;
          this.specialDayWorkingHours = new WorkingHours(0, this.idCompany, '',
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null));
          this.selectedSpecialDayWorkingHoursString = '';

          //[(ngModel)] converteste variabila la string si pot aparea probleme
          this.selectedSpecialDay = new SpecialDay(0, parseInt(this.selectedEntityId.toString()), this.selectedDate, this.isRepeatEveryYear,
            this.selectedSpecialDayWorkingHoursString);
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company special days', ''));
  }
  onUpdateWorkingHoursSpecialDay(value: WorkingHours)
  {
    let hoursIntervalString = ''
    if (this.selectedWeekDayIndex == 0) { hoursIntervalString = value.monday.workHours; }
    if (this.selectedWeekDayIndex == 1) { hoursIntervalString = value.tuesday.workHours; }
    if (this.selectedWeekDayIndex == 2) { hoursIntervalString = value.wednesday.workHours; }
    if (this.selectedWeekDayIndex == 3) { hoursIntervalString = value.thursday.workHours; }
    if (this.selectedWeekDayIndex == 4) { hoursIntervalString = value.friday.workHours; }
    if (this.selectedWeekDayIndex == 5) { hoursIntervalString = value.saturday.workHours; }
    if (this.selectedWeekDayIndex == 6) { hoursIntervalString = value.sunday.workHours; }

    this.selectedSpecialDayWorkingHoursString = hoursIntervalString;
  }
  saveSpecialDay()
  {
    try
    {
      let isAdd = (this.selectedSpecialDay.id == 0 ? true : false);

      this.selectedSpecialDay.workingHours = this.selectedSpecialDayWorkingHoursString;
      this.selectedSpecialDay.isEveryYear = this.isRepeatEveryYear;
      this.selectedSpecialDay.day = this.selectedDate;


      this.entitiesService.setEntitySpecialDays(isAdd, this.selectedSpecialDay)
        .subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);


            if (gro.objList != null && gro.objList.length > 0)
            {
              this.affectedBookings = gro.objList;
              this.displayAffectedBookings = true;
            }
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Add, '', 'saved entity special day', true, this.getCurrentLabelValue('lblSaved'));
            //this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));            
          }
          this.loadEntitySpecialDays();
        },
          err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding entity special day', '')
        );
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Add, ex.message, '');
      this.showPageMessage('error', 'Error', ex.message);
      this.loadEntitySpecialDays();
    }

    this.displayDialogSpecialDays = false;
  }
  updateSpecialDayAfterDrop(initialDate: Date, newDate: Date)
  {
    try
    {
      this.entitiesService.getEntitySpecialDays(this.selectedEntityId, initialDate).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
          //this.showPageMessage('error', 'Error', gro.error);
        }
        else
        {
          let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
          this.selectedSpecialDay = sd[0];
          this.selectedSpecialDay.day = newDate;

          this.entitiesService.setEntitySpecialDays(false, this.selectedSpecialDay)
            .subscribe(result =>
            {
              let gro = <GenericResponseObject>result;
              if (gro.error != '')
              {
                this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
                //this.showPageMessage('error', 'Error', gro.error);

              }
              else
              {
                this.logAction(this.idCompany, false, Actions.Add, '', 'saved entity special day', true, this.getCurrentLabelValue('lblSaved'));
                //this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
              }
              this.loadEntitySpecialDays();
            },
              err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding entity special day', ''));
        }
      },
        err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entity special days', ''));
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Add, ex.message, '');
      this.showPageMessage('error', 'Error', ex.message);
      this.loadEntitySpecialDays();
    }
  }
  removeSpecialDay()
  {
    this.entitiesService.deleteEntitySpecialDay(this.selectedSpecialDay.id, this.selectedEntity.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'deleted entity special day', true, '');
        //this.showPageMessage('success', 'Success', '');
        this.loadEntitySpecialDays();
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleting entity special day', ''));

    this.displayDialogSpecialDays = false;
  }
  onBookingRemoved(event: string)
  {
    this.displayAffectedBookings = false;
    if (event == "removed")
    {
      this.logAction(this.idCompany, false, Actions.Delete, "", "", true, "Booking removed");
    }
    else
    {
      this.logAction(this.idCompany, true, Actions.Delete, event, event, true);
    }
  }

  convertWeekDayIndex(jsIndex)
  {
    let normalIndex = 0;
    if (jsIndex == 1) { normalIndex = 0; }//monday
    if (jsIndex == 2) { normalIndex = 1; }//tuesday
    if (jsIndex == 3) { normalIndex = 2; }//wednesday
    if (jsIndex == 4) { normalIndex = 3; }//thursday
    if (jsIndex == 5) { normalIndex = 4; }//friday
    if (jsIndex == 6) { normalIndex = 5; }//saturday
    if (jsIndex == 0) { normalIndex = 6; }//sunday

    return normalIndex;
  }
}

