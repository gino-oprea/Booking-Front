import { Component, OnInit, EventEmitter, Output, Injector, Input, OnChanges } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';

import { LevelAsFilter } from '../../objects/level-as-filter';
import { BookingService } from '../../app-services/booking.service';
import { LevelLinkingService } from '../../app-services/level-linking.service';
import { WebSites, Actions, FieldType, UserRoleEnum, LevelType } from '../../enums/enums';
import { EntitiesLink } from '../../objects/entities-link';
import { Entity } from '../../objects/entity';
import { SelectedEntityPerLevel } from '../../objects/selected-entity-per-level';
import { BookingFilter } from '../../objects/booking-filter';
import { SimpleChanges } from '@angular/core';
import { CommonServiceMethods } from '../../app-services/common-service-methods';
import { ImageService } from '../../app-services/image.service';
import { GenericResponseObject } from 'app/objects/generic-response-object';
import { Image } from '../../objects/image';
import { CompanyUsersService } from '../../app-services/company-users.service';
import { CompanyUser } from '../../objects/user';

class SelectedCharacteristic
{
  constructor(
    public selectedIdLevel?: number,
    public selectedIdCharacteristic?: number,
    public selectedValue?: string
  ) { }
}

@Component({
  selector: 'bf-booking-filter2',
  templateUrl: './booking-filter2.component.html',
  styleUrls: ['./booking-filter2.component.css']
})
export class BookingFilter2Component extends BaseComponent implements OnInit, OnChanges
{
  @Input() isMoveBookingFilter: boolean = false;

  @Input() idCompany: number;
  @Input() selectedDate: Date = new Date();
  @Input() isFilteredByEmployeeRole: boolean = false;
  @Input() doResetFilters: boolean = false;
  @Output() filterChanged = new EventEmitter<BookingFilter>();

  en: any;
  ro: any;
  today: Date = new Date();
  levels: LevelAsFilter[];
  allEntityCombinations: Entity[][] = [];
  selectedEntities: SelectedEntityPerLevel[] = [];
  filteredLevels: LevelAsFilter[];
  filteredLevelsForDropdowns: LevelAsFilter[];//obiectul legat la interfata
  selectedCharacteristics: SelectedCharacteristic[] = [];

  companyUsers: CompanyUser[] = [];
  currentUserIsEmployee: boolean = false;


  constructor(private injector: Injector,
    private bookingService: BookingService,
    private levelLinkingService: LevelLinkingService,
    private imageService: ImageService,
    private companyUsersService: CompanyUsersService)
  {
    super(injector, [
      'lblResetFilters'
    ]);
    this.site = WebSites.Front;
    this.pageName = 'Booking filters';

    this.en = {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
    this.ro = {
      firstDayOfWeek: 1,
      dayNames: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"],
      dayNamesShort: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"],
      dayNamesMin: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"],
      monthNames: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
      monthNamesShort: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
  }

  ngOnInit()
  {

  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes['idCompany'])
    {
      if (this.idCompany)
        if (this.isFilteredByEmployeeRole)
          this.companyUsersService.getCompanyUsers(this.idCompany).subscribe(gro =>
          {
            if (gro.error != "")
              this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
            else
            {
              this.companyUsers = <CompanyUser[]>gro.objList;
            }
            this.loadAllLevels();
          });
        else
          this.loadAllLevels();
    }

    if (changes['doResetFilters'])
    {
      if (changes['doResetFilters'].currentValue != changes['doResetFilters'].previousValue)
        if (this.levels != null)
          this.resetFilters();
    }
  }
  filterByUserRole()
  {
    let user = this.loginService.getCurrentUser();
    if (user)
    {
      //if (user.roles)
      // if (user.roles.find(r => r.idRole == UserRoleEnum.Employee && r.idCompany == this.idCompany))
      // {
      let companyUserLoggedIn = this.companyUsers.find(cu => cu.id == user.id)
      if (companyUserLoggedIn)
      {
        let idEntityLinked = companyUserLoggedIn.linkedIdEntity;
        if (idEntityLinked)
        {
          this.currentUserIsEmployee = true;

          let employeesLevel = this.levels.find(l => l.idLevelType == LevelType.Employee)

          let selectedEntitySet = new SelectedEntityPerLevel(employeesLevel.id, idEntityLinked, employeesLevel.idLevelType);
          this.selectedEntities.push(selectedEntitySet);

          for (let i = employeesLevel.entities.length - 1; i >= 0; i--)
          {
            const empEnt = employeesLevel.entities[i];
            if (empEnt.id != idEntityLinked)
              employeesLevel.entities.splice(i, 1);
          }
        }
      }
      //}
    }
  }
  loadAllLevels()
  {
    let weekDates: string[];
    weekDates = this.setUpWeekDates()
    this.bookingService.getLevelsAsFilters(this.idCompany, weekDates).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.levels = <LevelAsFilter[]>gro.objList;

        if (this.isFilteredByEmployeeRole)
          this.filterByUserRole();

        //console.log(this.levels);
        this.initFilteredEntities();
        this.initSelectedEntities();

        this.initSelectedCharacteristics();
        this.loadEntitiesLinking();
        //console.log(this.selectedEntities);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error loading booking filters', ''));
  }
  loadEntitiesLinking()
  {
    this.levelLinkingService.getEntitiesLinking(null, this.idCompany).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        let entityLinks = <EntitiesLink[]>gro.objList;
        this.addChildEntityIdsToParentEntities(entityLinks);

        let firstLevelEntities = this.levels.find(l => l.orderIndex == 1).entities;
        let currentCombination: Entity[] = [];
        this.getAllLinkedEntitiesCombinations(firstLevelEntities, currentCombination, this.allEntityCombinations);
        //console.log(this.allEntityCombinations);
        this.applyFilter();
      }
    },
      er => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities linking', ''));
  }
  addChildEntityIdsToParentEntities(entityLinks: EntitiesLink[])
  {
    this.levels.forEach(l =>
    {
      l.entities.forEach(e =>
      {
        entityLinks.forEach(el =>
        {
          if (e.childEntityIds == null)
            e.childEntityIds = [];
          if (e.id == el.idParentEntity)
            e.childEntityIds.push(el.idChildEntity);
        });
      });
    });
  }
  //currentEntities- entitatile de pe nivelul curent(pe orizontala)
  //currentCombination- entitatile legate pe verticala
  //resultCombinations- combinatiile rezultate dupa fiecare pas
  getAllLinkedEntitiesCombinations(currentEntities: Entity[], currentCombination: Entity[], resultCombinations: Entity[][])
  {
    for (let i = 0; i < currentEntities.length; i++)
    {
      let currentEntity = currentEntities[i];
      currentCombination.push(currentEntity);

      if (currentEntity.childEntityIds && currentEntity.childEntityIds.length > 0)
      {
        let childEntities = this.getEntitiesByIds(currentEntity.childEntityIds);
        this.getAllLinkedEntitiesCombinations(childEntities, currentCombination, resultCombinations);
      }
      else
      {
        ////copy id list
        let tempEntList: Entity[] = [];
        currentCombination.forEach(e =>
        {
          tempEntList.push(e);
        });
        resultCombinations.push(tempEntList);
      }
      currentCombination.splice(currentCombination.length - 1, 1);//backtracking cu un pas mai sus pe combinatia gasita ca sa sare pe copilul urmator
    }
  }
  getEntitiesByIds(entityIds: number[]): Entity[]
  {
    let resultEntities: Entity[] = [];
    entityIds.forEach(ei =>
    {
      this.levels.forEach(l =>
      {
        l.entities.forEach(e =>
        {
          if (ei == e.id)
            resultEntities.push(e);
        });
      });
    });
    return resultEntities;
  }
  initFilteredEntities()
  {
    this.filteredLevels = JSON.parse(JSON.stringify(this.levels));
    this.filteredLevelsForDropdowns = JSON.parse(JSON.stringify(this.levels));
  }
  initSelectedEntities(isReset: boolean = false)
  {
    if (isReset)
      this.selectedEntities = [];

    for (var i = 0; i < this.levels.length; i++)
    {
      let entity = new SelectedEntityPerLevel(this.levels[i].id, -1, this.levels[i].idLevelType);
      if (this.selectedEntities.find(se => se.idLevel == this.levels[i].id) == null || isReset)
        this.selectedEntities.push(entity);
    }
  }

  initSelectedCharacteristics()
  {
    this.selectedCharacteristics = [];
    for (var i = 0; i < this.levels.length; i++)
    {
      for (var j = 0; j < this.levels[i].levelCharacteristics.length; j++)
      {
        let c = new SelectedCharacteristic();
        c.selectedIdLevel = this.levels[i].id;
        c.selectedIdCharacteristic = this.levels[i].levelCharacteristics[j].id;
        c.selectedValue = "-1";

        this.selectedCharacteristics.push(c);
      }
    }
  }
  setUpWeekDates(): string[]
  {
    let weekDay = this.selectedDate.getDay();

    let mondayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));
    let tuesdayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));
    let wednesdayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));
    let thursdayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));
    let fridayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));
    let saturdayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));
    let sundayDate = new Date(this.selectedDate.getTime());// + this.invertNumberSign(_userOffset));

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

    mondayDate.setHours(0, 0, 0, 0);
    tuesdayDate.setHours(0, 0, 0, 0);
    wednesdayDate.setHours(0, 0, 0, 0);
    thursdayDate.setHours(0, 0, 0, 0);
    fridayDate.setHours(0, 0, 0, 0);
    saturdayDate.setHours(0, 0, 0, 0);
    sundayDate.setHours(0, 0, 0, 0);

    let weekDates = [];
    weekDates.push(CommonServiceMethods.getDateString(mondayDate));
    weekDates.push(CommonServiceMethods.getDateString(tuesdayDate));
    weekDates.push(CommonServiceMethods.getDateString(wednesdayDate));
    weekDates.push(CommonServiceMethods.getDateString(thursdayDate));
    weekDates.push(CommonServiceMethods.getDateString(fridayDate));
    weekDates.push(CommonServiceMethods.getDateString(saturdayDate));
    weekDates.push(CommonServiceMethods.getDateString(sundayDate));

    return weekDates;
  }

  resetInvalidSelections(idSelectedLevel: number)
  {
    let foundValidCombination: boolean = false;
    for (let i = 0; i < this.allEntityCombinations.length; i++)
    {
      if (this.isValidCombination(this.allEntityCombinations[i]))
      {
        foundValidCombination = true;
        break;
      }
    }
    if (!foundValidCombination)
    {
      let ents = this.selectedEntities.filter(e => e.idLevel != idSelectedLevel);
      for (let j = 0; j < ents.length; j++)
      {
        ents[j].idEntity = -1;//deselect
        ents[j].images = null;
      }
    }
  }
  setupFilterObjectForEmit(filteredEntititesPerLevel: Entity[][])
  {
    //le punem in obiectul care trebuie emis
    for (let i = 0; i < filteredEntititesPerLevel.length; i++)
    {
      let filteredEntities = filteredEntititesPerLevel[i];
      for (let j = 0; j < this.filteredLevels.length; j++)
      {
        let filteredLevel = this.filteredLevels[j];
        if (filteredEntities.length > 0)
          if (filteredLevel.id == filteredEntities[0].idLevel)
            filteredLevel.entities = filteredEntities;
      }
    }
    ////
  }
  setupFilterObjectForDropdowns(filteredEntititesPerLevel: Entity[][], idLevel: number)
  {
    //le punem in obiectul legat la interfata -- diferenta e ca aici nu filtram dropdown-ul care a declansat filtrarea si trebuie reinitializate valorile ca sa nu fie afectate de filtrari repetate
    this.filteredLevelsForDropdowns = JSON.parse(JSON.stringify(this.levels));
    for (let i = 0; i < filteredEntititesPerLevel.length; i++)
    {
      let filteredEntities = filteredEntititesPerLevel[i];
      for (let j = 0; j < this.filteredLevelsForDropdowns.length; j++)
      {
        let filteredLevelForDropdowns = this.filteredLevelsForDropdowns[j];
        if (filteredEntities.length > 0)
          if (filteredLevelForDropdowns.id == filteredEntities[0].idLevel && filteredLevelForDropdowns.id != idLevel)
            filteredLevelForDropdowns.entities = filteredEntities;
      }
    }
    ///////
  }
  doFilterEntities(idLevel: number)
  {
    let selectedIdEntity = this.selectedEntities.find(e => e.idLevel == idLevel).idEntity
    if (selectedIdEntity == -1)
      this.selectedEntities.find(e => e.idLevel == idLevel).images = null;
    else
      this.loadEntityImages(this.selectedEntities.find(e => e.idLevel == idLevel).idEntity);

    //reset invalid selections
    this.resetInvalidSelections(idLevel);
    this.resetSelectedCharacteristics(idLevel, false);
    let filteredEntititesPerLevel = this.getFilteredEntitiesPerLevel();
    this.setupFilterObjectForEmit(filteredEntititesPerLevel);
    this.setupFilterObjectForDropdowns(filteredEntititesPerLevel, idLevel);

    this.applyFilter();
  }
  getSelectedImage(idLevel: number): string
  {
    let images: Image[] = this.selectedEntities.find(e => e.idLevel == idLevel).images;
    if (images && images.length > 0)
      return this.selectedEntities.find(e => e.idLevel == idLevel).images[0].img;
    else
      return null;
  }
  loadEntityImages(idEntity: number)
  {
    this.imageService.getEntityImages(idEntity).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        let images = <Image[]>gro.objList;
        this.selectedEntities.find(e => e.idEntity == idEntity).images = images;
      }
    });
  }
  getFilteredEntitiesPerLevel(): Entity[][]
  {
    let filteredEntitiesPerLevel: Entity[][] = []

    //filtram path-urile dupa selected entities(trebuie pastrate doar cele care contin toate entitatile selectate)
    let filteredCombinations: Entity[][] = [];
    for (let i = 0; i < this.allEntityCombinations.length; i++)
    {
      if (this.isValidCombination(this.allEntityCombinations[i]))
        filteredCombinations.push(this.allEntityCombinations[i]);
    }
    /////

    ////grupare per nivel
    if (filteredCombinations.length > 0)
    {
      let levelsNumber = this.getMaxDepth(filteredCombinations);

      for (let i = 0; i < levelsNumber; i++)
      {
        let levelEntitites: Entity[] = [];
        filteredCombinations.forEach(combination =>
        {
          if (combination.length > i)
          {
            var exists = levelEntitites.filter(e => e.id == combination[i].id);
            if (exists.length == 0)//nu mai exista
              levelEntitites.push(combination[i]);
          }
        });
        filteredEntitiesPerLevel.push(levelEntitites);
      }
    }
    return filteredEntitiesPerLevel;
  }
  isValidCombination(combination: Entity[]): boolean//filtreaza combinatiile pe baza selectiei utilizatorului
  {
    let containsAll = true;

    for (let i = 0; i < this.selectedEntities.length; i++)
    {
      let isFound = false;
      let selectedEntity = this.selectedEntities[i];
      for (let j = 0; j < combination.length; j++)
      {
        if (selectedEntity.idEntity == combination[j].id || selectedEntity.idEntity == -1)
        {
          isFound = true;
          break;
        }
      }

      if (!isFound)
      {
        containsAll = false;
        break;
      }
    }

    return containsAll;
  }
  getMaxDepth(combinations: Entity[][]): number
  {
    if (combinations.length > 0)
    {
      let max = combinations[0].length;
      for (let i = 0; i < combinations.length; i++)
      {
        if (combinations[0].length > max)
          max = combinations[0].length;
      }
      return max;
    }
    else
      return 0;
  }
  resetSelectedCharacteristics(idLevel: number, resetCurrentLevel: boolean)
  {
    for (let i = 0; i < this.selectedCharacteristics.length; i++)
    {
      const selCharact = this.selectedCharacteristics[i];
      if (resetCurrentLevel)
      {
        if (selCharact.selectedIdLevel == idLevel)//se reseteaza doar caracteristicile de pe nivelul curent
          selCharact.selectedValue = "-1";
      }
      else
      {
        if (selCharact.selectedIdLevel != idLevel)//se reseteaza doar caracteristicile de pe celelealte niveluri
          if (!this.isLevelEntitySelected(selCharact.selectedIdLevel))  //doar daca nivelul nu are selectie
            selCharact.selectedValue = "-1";
      }
    }
  }
  isLevelEntitySelected(idLevel: number): boolean
  {
    for (var i = 0; i < this.selectedEntities.length; i++)
    {
      var levelEntity = this.selectedEntities[i];
      //if (levelEntities.length > 0)
      if (levelEntity.idLevel == idLevel)//if (levelEntities[0].idLevel == idLevel)
      {
        if (levelEntity.idEntity != -1)
          return true;
      }
    }
    return false;
  }

  getSelectedEntitiesByIdLevel(idLevel: number): SelectedEntityPerLevel
  {
    var entity = this.selectedEntities.find(e => e.idLevel == idLevel);
    return entity;
  }
  generateBookingFilter(): BookingFilter
  {
    return new BookingFilter(this.filteredLevels, this.allEntityCombinations, this.selectedDate);
  }

  applyFilter()
  {
    let bookingFilter = this.generateBookingFilter();
    this.filterChanged.emit(bookingFilter);
  }
  resetFilters()
  {
    this.initSelectedEntities(true);
    this.initSelectedCharacteristics();
    this.initFilteredEntities();
    this.applyFilter();
  }


  ///////
  ///////additional characteristic code
  getSelectedCharacteristic(idLevel: number, idCharact: number): SelectedCharacteristic
  {
    return this.selectedCharacteristics.find(c => c.selectedIdLevel == idLevel && c.selectedIdCharacteristic == idCharact);
  }
  doFilterEntitiesByCharacteristics(idLevel: number)
  {
    let filteredEntititesPerLevel = this.getFilteredEntitiesPerLevel();
    this.setupFilterObjectForDropdowns(filteredEntititesPerLevel, idLevel);//start from level filtering each time

    let characteristicFilters = this.selectedCharacteristics.filter(c => c.selectedIdLevel == idLevel);
    let levelFilterForDropdowns = this.filteredLevelsForDropdowns.find(l => l.id == idLevel);
    let filteredEntities = levelFilterForDropdowns.entities.filter(e =>
    {
      let count = 0;
      for (let i = 0; i < characteristicFilters.length; i++)
      {
        let charactFilter = characteristicFilters[i];
        let entCharact = e.characteristics.find(c => c.id == charactFilter.selectedIdCharacteristic);

        //aici trebuie tinut cont si de cultura
        if (charactFilter.selectedValue == "-1"
          || entCharact.numericValue == parseInt(charactFilter.selectedValue)
          || entCharact.textValue_EN == charactFilter.selectedValue)
          count++
      }
      if (count == characteristicFilters.length)
        return true;
      else
        return false;
    });

    levelFilterForDropdowns.entities = filteredEntities;

    this.selectedEntities.find(se => se.idLevel == idLevel).idEntity = -1;

    filteredEntititesPerLevel = this.getFilteredEntitiesPerLevel();
    this.setupFilterObjectForEmit(filteredEntititesPerLevel);
    this.applyFilter();
  }
}
