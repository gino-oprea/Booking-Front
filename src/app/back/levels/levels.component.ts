import { Level } from '../../objects/level';
import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { Actions, DurationType, WebSites } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { LevelsService } from '../../app-services/levels.service';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { GenericDictionaryItem } from '../../objects/generic-dictionary-item';
import { LevelAdditionalCharacteristic } from '../../objects/level-additional-characteristic';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntitiesService } from '../../app-services/entities.service';
import { Entity } from '../../objects/entity';
import { CommonServiceMethods } from '../../app-services/common-service-methods';
import { first } from 'rxjs/operators';
import { ServiceDurationItem } from '../../objects/service-duration-item';


@Component({
  selector: 'bf-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent extends BaseComponent implements OnInit 
{
  addLevelForm: FormGroup;
  addEntityForm: FormGroup;
  addLevelCharactForm: FormGroup;

  levels: Level[] = [];
  durationTypes: GenericDictionaryItem[] = [];
  types: GenericDictionaryItem[] = [];
  levelFieldTypes: GenericDictionaryItem[] = [];
  levelCharacteristics: LevelAdditionalCharacteristic[] = [];
  entities: Entity[] = [];

  displayConfirmDeleteLevel = false;
  confirmDeleteLevelMessage: string;
  //pentru dialogul de add level  
  isAddLevelMode = true;
  isSubmitLevel = true;
  //pentru dialogul de add characteristic
  isAddCharacteristicMode = true;
  isSubmitCharact = true;
  //pentru dialogul de add entity
  isAddEntityMode = true;
  isSubmitEntity = true;

  displayDialogAddEntity = false;
  displayDialogAddLevel = false;
  displayDialogAddLevelCharacteristic = false;
  selectedLevel: string;
  selectedLevelCharacteristic: LevelAdditionalCharacteristic;
  //selectedLevelTypeForAdd: string = '1';
  selectedLevelTypeForEdit: string = '1';
  durationArray: ServiceDurationItem[];


  constructor(private injector: Injector,
    private levelsService: LevelsService,
    private entitiesService: EntitiesService)
  {
    super(injector, []);
    this.site = WebSites.Back;
    this.pageName = "Levels";

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });



    this.initFormAddLevel();
    this.initFormAddEntity();
    this.initFormAddLevelCharacteristic();

    this.loadDurationTypes();
    this.loadLevels();
    this.loadLevelTypes();
    this.loadLevelFieldTypes();
  }

  ngOnInit() 
  {
    super.ngOnInit();
  }
  loadDurationArray(type: DurationType)
  {
    this.durationArray = CommonServiceMethods.getDurationArray(type);
    if (this.durationArray.find(n => n.value.toString() == this.addLevelForm.controls['duration'].value) == null)
      this.addLevelForm.controls['duration'].setValue(this.durationArray[0].value);
  }

  loadLevels(idLevel: string = null)
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
        if (gro.objList.length > 0)
        {
          this.levels = <Level[]>gro.objList;

          this.selectedLevel = this.levels[0].id.toString();
          if (idLevel != null) this.selectedLevel = idLevel;
          this.loadEntities(parseInt(this.selectedLevel));
          this.loadLevelCharacteristics(null, parseInt(this.selectedLevel));
        }
      }

    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting levels', ''));

  }
  loadDurationTypes()
  {
    this.levelsService.getDurationTypes().subscribe(result =>
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
        this.loadDurationArray(<DurationType>parseInt(this.addLevelForm.controls["duration_type"].value));
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting duration types', ''));
  }
  loadLevelTypes()
  {
    this.levelsService.getLevelTypes().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.types = <GenericDictionaryItem[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting level types', ''));
  }
  loadLevelFieldTypes()
  {
    this.levelsService.getLevelFieldTypes().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.levelFieldTypes = <GenericDictionaryItem[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting level fields types', ''));
  }
  loadLevelCharacteristics(idCharacteristic: number, idLevel: number)
  {
    this.levelsService.getLevelAdditionalCharacteristics(idCharacteristic, idLevel).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.levelCharacteristics = <LevelAdditionalCharacteristic[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting level characteristics', ''));
  }
  loadEntities(idLevel: number)
  {
    this.entitiesService.getEntities(idLevel, null).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        //if (gro.objList.length > 0)
        //{
        this.entities = <Entity[]>gro.objList;
        //}
      }

    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities', ''));
  }

  initFormAddLevel()
  {
    if (this.isAddLevelMode)
    {
      this.addLevelForm = new FormGroup({
        'addLevelName_RO': new FormControl('', Validators.required),
        'addLevelName_EN': new FormControl('', Validators.required),
        'addLevelType': new FormControl('1'),
        'duration': new FormControl('30'),//aici trebuie pusa unitatea din setari
        'duration_type': new FormControl('1'),
        'addLevelIsMultipleBookings': new FormControl(false),
        'addLevelIsFrontOption': new FormControl(true)
      });
    }
    else
    {
      //se initializeaza pentru editare
      this.addLevelForm = new FormGroup({
        'addLevelName_RO': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).levelName_RO, Validators.required),
        'addLevelName_EN': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).levelName_EN, Validators.required),
        'addLevelType': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).idLevelType),
        'duration': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).defaultDuration),
        'duration_type': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).idDurationType),
        'addLevelIsMultipleBookings': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).isMultipleBooking),
        'addLevelIsFrontOption': new FormControl(this.getSelectedLevelObj(parseInt(this.selectedLevel)).isFrontOption)
      });
    }
  }
  // checkDuration(text)
  // {
  //   if (this.addLevelForm.controls['duration'].valid)
  //   {
  //     if (this.addLevelForm.controls['duration_type'].value == DurationType.Minutes)
  //     {
  //       let minutes = this.addLevelForm.controls['duration'].value;
  //       if (minutes >= (60 * 24))//mai mult de o zi
  //       {
  //         this.addLevelForm.controls['duration'].setValue(Math.floor(minutes / (60 * 24)));
  //         this.addLevelForm.controls['duration_type'].setValue(DurationType.Days);
  //       }
  //     }  
  //     if (this.addLevelForm.controls['duration_type'].value == DurationType.Hours)
  //     {
  //       let hours = this.addLevelForm.controls['duration'].value;
  //       if (hours >= 24)//mai mult de o zi
  //       {
  //         this.addLevelForm.controls['duration'].setValue(Math.floor(hours / 24));
  //         this.addLevelForm.controls['duration_type'].setValue(DurationType.Days);
  //       }
  //     }        
  //   }  
  // }

  getSelectedLevelObj(id: number): Level
  {
    for (var i = 0; i < this.levels.length; i++) 
    {
      if (this.levels[i].id == id)
      {
        return this.levels[i];
      }
    }
  }
  initFormAddEntity()
  {
    this.addEntityForm = new FormGroup({
      'addEntityName_RO': new FormControl('', Validators.required),
      'addEntityName_EN': new FormControl('', Validators.required)
    });
  }
  initFormAddLevelCharacteristic()
  {
    if (this.isAddCharacteristicMode)
    {
      this.addLevelCharactForm = new FormGroup({
        'addLevelCharactName_RO': new FormControl('', Validators.required),
        'addLevelCharactName_EN': new FormControl('', Validators.required),
        'addLevelCharactFieldType': new FormControl('1'),
        'addLevelCharactIsFrontOption': new FormControl(true)
      });
    }
    else
    {
      this.addLevelCharactForm = new FormGroup({
        'addLevelCharactName_RO': new FormControl(this.selectedLevelCharacteristic.characteristicName_RO, Validators.required),
        'addLevelCharactName_EN': new FormControl(this.selectedLevelCharacteristic.characteristicName_EN, Validators.required),
        'addLevelCharactFieldType': new FormControl(this.selectedLevelCharacteristic.idFieldType),
        'addLevelCharactIsFrontOption': new FormControl(this.selectedLevelCharacteristic.isFrontOption)
      });
    }
  }
  onDdlChangeLevel()
  {
    this.loadLevelCharacteristics(null, parseInt(this.selectedLevel));
    this.loadEntities(parseInt(this.selectedLevel));
  }
  onDdlChangeLevelType()
  {
    if (this.addLevelForm.controls["addLevelType"].value == 1)//general structure
    {
      this.addLevelForm.controls['addLevelIsMultipleBookings'].setValue(false);
    }
    if (this.addLevelForm.controls["addLevelType"].value == 2)//serviciu
    {
      this.addLevelForm.controls['addLevelIsMultipleBookings'].setValue(true);
    }
    if (this.addLevelForm.controls["addLevelType"].value == 3)//angajat
    {
      this.addLevelForm.controls['addLevelIsMultipleBookings'].setValue(false);
    }
  }
  showAddEntityDialog()
  {
    this.displayDialogAddEntity = true;
    this.initFormAddEntity();
  }
  editEntity(idEntity: number)
  {
    this.router.navigate(['../entities', this.selectedLevel, idEntity.toString()], { relativeTo: this.route });
  }
  showLevelDialog(isAdd: boolean)
  {
    this.isAddLevelMode = isAdd;
    this.displayDialogAddLevel = true;
    this.initFormAddLevel();
    this.loadDurationArray(<DurationType>parseInt(this.addLevelForm.controls["duration_type"].value));
  }

  showAddLevelCharacteristicDialog(isAdd: boolean)
  {
    this.isAddCharacteristicMode = isAdd;
    this.displayDialogAddLevelCharacteristic = true;
    this.initFormAddLevelCharacteristic();
  }
  setLevelSubmitType(type: boolean)
  {
    this.isSubmitLevel = type;
  }
  setCharacteristicSubmitType(type: boolean)
  {
    this.isSubmitCharact = type;
  }
  setEntitySubmitType(type: boolean)
  {
    this.isSubmitEntity = type;
  }


  onAddLevelForm()
  {
    if (this.isSubmitLevel)//save
    {
      if (this.isAddLevelMode)//daca e add
      {
        let newLevel = new Level();
        newLevel.idCompany = this.idCompany;
        newLevel.idLevelType = parseInt(this.addLevelForm.controls["addLevelType"].value);
        newLevel.defaultDuration = parseInt(this.addLevelForm.controls["duration"].value);
        newLevel.idDurationType = parseInt(this.addLevelForm.controls["duration_type"].value);
        newLevel.levelName_RO = this.addLevelForm.controls["addLevelName_RO"].value;
        newLevel.levelName_EN = this.addLevelForm.controls["addLevelName_EN"].value;
        newLevel.isFrontOption = this.addLevelForm.controls["addLevelIsFrontOption"].value;
        newLevel.isMultipleBooking = this.addLevelForm.controls["addLevelIsMultipleBookings"].value;

        this.levelsService.addLevel(newLevel).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
            //this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            let idLevelAdded = gro.objList[0];
            this.logAction(this.idCompany, false, Actions.Add, '', 'add level ' + newLevel.levelName_RO, true, 'Level added');
            //one time subscription - trebuie facut reload la levels abia dupa ce se emite noul token cu claim-urile corecte
            this.loginService.loginSubject.pipe(first()).subscribe(login =>
            {
              this.loadLevels(idLevelAdded);
            });

            this.autoLogin();//mai sus e pregatit subscriptionul ca sa prinda schimbarea de token si sa faca refresh la levels 

          }
        },
          err =>
          {
            this.logAction(this.idCompany, true, Actions.Add, 'http error adding level', err.status + ' ' + err.statusText);
            this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
          });
      }
      else//daca e update
      {
        let levelToUpdate = this.getSelectedLevelObj(parseInt(this.selectedLevel));
        levelToUpdate.idLevelType = parseInt(this.addLevelForm.controls["addLevelType"].value);
        levelToUpdate.defaultDuration = parseInt(this.addLevelForm.controls["duration"].value);
        levelToUpdate.idDurationType = parseInt(this.addLevelForm.controls["duration_type"].value);
        levelToUpdate.levelName_RO = this.addLevelForm.controls["addLevelName_RO"].value;
        levelToUpdate.levelName_EN = this.addLevelForm.controls["addLevelName_EN"].value;
        levelToUpdate.isFrontOption = this.addLevelForm.controls["addLevelIsFrontOption"].value;
        levelToUpdate.isMultipleBooking = this.addLevelForm.controls["addLevelIsMultipleBookings"].value;

        this.levelsService.updateLevel(levelToUpdate).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
            //this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            ///this.showPageMessage('success', 'Success', 'Level updated');
            this.logAction(this.idCompany, false, Actions.Edit, '', 'edit level ' + levelToUpdate.levelName_RO, true, 'Level updated');
            this.loadLevels();
          }
        },
          err =>
          {
            this.logAction(this.idCompany, true, Actions.Add, 'http error updating level', err.status + ' ' + err.statusText);
            this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
          });
      }
    }
    else//delete
    {
      this.confirmDeleteLevelMessage = "Are you sure you want to delete level: " + this.getSelectedLevelObj(parseInt(this.selectedLevel)).levelName_EN;
      this.displayConfirmDeleteLevel = true;
    }
    this.displayDialogAddLevel = false;
  }
  deleteLevel()
  {
    this.levelsService.deleteLevel(parseInt(this.selectedLevel)).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        //this.showPageMessage('success', 'Success', 'Level removed');
        this.logAction(this.idCompany, false, Actions.Delete, '', 'Remove level ' + this.levels.find(l => l.id.toString() == this.selectedLevel), true, 'Level removed');
        this.loadLevels();
      }
    },
      err =>
      {
        this.logAction(this.idCompany, true, Actions.Delete, 'http error removing level', err.status + ' ' + err.statusText);
        this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
      });
  }
  onConfirmDeleteLevel(message: string)
  {
    if (message == "yes")
      this.deleteLevel();
    this.displayConfirmDeleteLevel = false;
  }
  onAddLevelCharactForm()
  {
    if (this.isSubmitCharact)//save
    {
      if (this.isAddCharacteristicMode)//daca e add
      {
        let newCharacteristic = new LevelAdditionalCharacteristic();
        newCharacteristic.idLevel = parseInt(this.selectedLevel);
        newCharacteristic.characteristicName_RO = this.addLevelCharactForm.controls["addLevelCharactName_RO"].value;
        newCharacteristic.characteristicName_EN = this.addLevelCharactForm.controls["addLevelCharactName_EN"].value;
        newCharacteristic.idFieldType = parseInt(this.addLevelCharactForm.controls["addLevelCharactFieldType"].value);
        newCharacteristic.isFrontOption = this.addLevelCharactForm.controls["addLevelCharactIsFrontOption"].value;

        this.levelsService.addLevelAdditionalCharacteristic(newCharacteristic).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
            //this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            //this.showPageMessage('success', 'Success', 'Level characteristic added');
            this.logAction(this.idCompany, false, Actions.Add, '', 'add level characteristic ' + newCharacteristic.characteristicName_RO, true, 'Level characteristic added');
            this.loadLevelCharacteristics(null, parseInt(this.selectedLevel));
          }
        },
          err =>
          {
            this.logAction(this.idCompany, true, Actions.Add, 'http error adding level characteristic', err.status + ' ' + err.statusText);
            this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
          });
      }
      else//daca e update
      {
        let characteristicToUpdate = this.selectedLevelCharacteristic;
        characteristicToUpdate.characteristicName_RO = this.addLevelCharactForm.controls["addLevelCharactName_RO"].value;
        characteristicToUpdate.characteristicName_EN = this.addLevelCharactForm.controls["addLevelCharactName_EN"].value;
        characteristicToUpdate.idFieldType = parseInt(this.addLevelCharactForm.controls["addLevelCharactFieldType"].value);
        characteristicToUpdate.isFrontOption = this.addLevelCharactForm.controls["addLevelCharactIsFrontOption"].value;

        this.levelsService.editLevelAdditionalCharacteristic(characteristicToUpdate).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
            //this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            //this.showPageMessage('success', 'Success', 'Level characteristic updated');
            this.logAction(this.idCompany, false, Actions.Edit, '', 'edit level characteristic' + characteristicToUpdate.characteristicName_RO, true, 'Characteristic updated');
            this.loadLevelCharacteristics(null, parseInt(this.selectedLevel));
          }
        },
          err =>
          {
            this.logAction(this.idCompany, true, Actions.Edit, 'http error updating level characteristic', err.status + ' ' + err.statusText);
            this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
          });
      }
    }
    else//delete
    {
      this.levelsService.deleteLevelAdditionalCharacteristic(this.selectedLevelCharacteristic.id, parseInt(this.selectedLevel)).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
          //this.showPageMessage('error', 'Error', gro.error);
        }
        else
        {
          //this.showPageMessage('success', 'Success', 'Characteristic removed');
          this.logAction(this.idCompany, false, Actions.Delete, '', 'Remove level characteristic '
            + this.selectedLevelCharacteristic.characteristicName_RO, true, 'Level characteristic removed');
          this.loadLevelCharacteristics(null, parseInt(this.selectedLevel));
        }
      },
        err =>
        {
          this.logAction(this.idCompany, true, Actions.Delete, 'http error removing level characteristic', err.status + ' ' + err.statusText);
          this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
        });
    }
    this.displayDialogAddLevelCharacteristic = false;
  }
  onAddEntityForm()
  {
    if (this.isSubmitEntity)//save
    {
      if (this.isAddEntityMode)//daca e add
      {
        let newEntity = new Entity();
        newEntity.idLevel = parseInt(this.selectedLevel);
        newEntity.entityName_RO = this.addEntityForm.controls["addEntityName_RO"].value;
        newEntity.entityName_EN = this.addEntityForm.controls["addEntityName_EN"].value;

        this.entitiesService.addEntity(newEntity).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
            //this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            //this.showPageMessage('success', 'Success', 'Entity added');
            this.logAction(this.idCompany, false, Actions.Add, '', 'add entity ' + newEntity.entityName_RO, true, 'Entity added');
            this.loadEntities(parseInt(this.selectedLevel));
            this.autoLogin();
          }
        },
          err =>
          {
            this.logAction(this.idCompany, true, Actions.Add, 'http error adding entity', err.status + ' ' + err.statusText);
            this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
          });
      }
      else//update
      {

      }
    }
    else//delete
    {

    }
    this.displayDialogAddEntity = false;
  }

}
