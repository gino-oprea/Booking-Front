import { Component, OnInit, EventEmitter, Output, Injector, Input, OnChanges } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';

import { LevelAsFilter } from '../../objects/level-as-filter';
import { BookingService } from '../../app-services/booking.service';
import { LevelLinkingService } from '../../app-services/level-linking.service';
import { WebSites, Actions, FieldType } from '../../enums/enums';
import { EntitiesLink } from '../../objects/entities-link';
import { Entity } from '../../objects/entity';
import { SelectedEntityPerLevel } from '../../objects/selected-entity-per-level';
import { BookingFilter } from '../../objects/booking-filter';
import { SimpleChanges } from '@angular/core';


class SelectedCharacteristic {
  constructor(
    public selectedIdLevel?: number,
    public selectedIdCharacteristic?: number,
    public selectedValue?: string
  ) { }
}


@Component({
  selector: 'bf-booking-filter',
  templateUrl: './booking-filter.component.html',
  styleUrls: ['./booking-filter.component.css']
})
export class BookingFilterComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() idCompany: number;
  @Output() filterChanged = new EventEmitter<BookingFilter>();

  en: any;
  today: Date = new Date();
  @Input() selectedDate: Date = new Date();
  levels: LevelAsFilter[];
  allEntityCombinations: Entity[][] = [];
  selectedEntities: SelectedEntityPerLevel[][] = [];//matrice cu entitati multiple selectate per level(pentru filtrare dupa caracteristici)
  filteredLevels: LevelAsFilter[];
  selectedCharacteristics: SelectedCharacteristic[] = [];


  constructor(private injector: Injector,
    private bookingService: BookingService,
    private levelLinkingService: LevelLinkingService) {
    super(injector, []);
    this.site = WebSites.Front;
    this.pageName = 'Booking filters';

    // this.routeSubscription = this.route.params.subscribe((params: any) =>
    // {
    //   if (params.hasOwnProperty('id'))
    //   {
    //     this.idCompany = +params['id'];
    //   }
    // });

    this.en = {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
  }

  ngOnInit() {
    //this.loadAllLevels();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.idCompany)
      this.loadAllLevels();
  }

  loadAllLevels() {
    let weekDates: string[];
    weekDates = this.setUpWeekDates()
    this.bookingService.getLevelsAsFilters(this.idCompany, weekDates).subscribe(gro => {
      if (gro.error != '') {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else {
        this.levels = <LevelAsFilter[]>gro.objList;
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
  setUpWeekDates(): string[] {
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
    weekDates.push(this.getDateString(mondayDate));
    weekDates.push(this.getDateString(tuesdayDate));
    weekDates.push(this.getDateString(wednesdayDate));
    weekDates.push(this.getDateString(thursdayDate));
    weekDates.push(this.getDateString(fridayDate));
    weekDates.push(this.getDateString(saturdayDate));
    weekDates.push(this.getDateString(sundayDate));

    return weekDates;
  }
  getDateString(date: Date) {
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();

    var dateString = year + "-" + month + "-" + day;
    return dateString;
  }
  loadEntitiesLinking() {
    this.levelLinkingService.getEntitiesLinking(null, this.idCompany).subscribe(gro => {
      if (gro.error != '') {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else {
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
  initSelectedEntities() {
    this.selectedEntities = [];
    for (var i = 0; i < this.levels.length; i++) {
      let entity = new SelectedEntityPerLevel(this.levels[i].id, -1, this.levels[i].idLevelType);
      this.selectedEntities.push([entity]);
    }
  }

  initSelectedCharacteristics() {
    this.selectedCharacteristics = [];
    for (var i = 0; i < this.levels.length; i++) {
      for (var j = 0; j < this.levels[i].levelCharacteristics.length; j++) {
        let c = new SelectedCharacteristic();
        c.selectedIdLevel = this.levels[i].id;
        c.selectedIdCharacteristic = this.levels[i].levelCharacteristics[j].id;
        c.selectedValue = "-1";

        this.selectedCharacteristics.push(c);
      }
    }
  }
  resetSelectedCharacteristics(idLevel: number, resetCurrentLevel: boolean) {
    for (let i = 0; i < this.selectedCharacteristics.length; i++) {
      const selCharact = this.selectedCharacteristics[i];
      if (resetCurrentLevel) {
        if (selCharact.selectedIdLevel == idLevel)//se reseteaza doar caracteristicile de pe nivelul curent
          selCharact.selectedValue = "-1";
      }
      else {
        if (selCharact.selectedIdLevel != idLevel)//se reseteaza doar caracteristicile de pe celelealte niveluri
          if (!this.isLevelEntitySelected(selCharact.selectedIdLevel))  //doar daca nivelul nu are selectie
            selCharact.selectedValue = "-1";
      }
    }
  }
  initFilteredEntities() {
    this.filteredLevels = JSON.parse(JSON.stringify(this.levels));
  }
  addChildEntityIdsToParentEntities(entityLinks: EntitiesLink[]) {
    this.levels.forEach(l => {
      l.entities.forEach(e => {
        entityLinks.forEach(el => {
          if (e.childEntityIds == null)
            e.childEntityIds = [];
          if (e.id == el.idParentEntity)
            e.childEntityIds.push(el.idChildEntity);
        });
      });
    });
  }

  getAllLinkedEntitiesCombinations(currentEntities: Entity[], currentCombination: Entity[], resultCombinations: Entity[][]) {
    for (let i = 0; i < currentEntities.length; i++) {
      let currentEntity = currentEntities[i];
      currentCombination.push(currentEntity);

      if (currentEntity.childEntityIds && currentEntity.childEntityIds.length > 0) {
        let childEntities = this.getEntitiesByIds(currentEntity.childEntityIds);
        this.getAllLinkedEntitiesCombinations(childEntities, currentCombination, resultCombinations);
      }
      else {
        ////copy id list
        let tempEntList: Entity[] = [];
        currentCombination.forEach(e => {
          tempEntList.push(e);
        });
        resultCombinations.push(tempEntList);
      }
      currentCombination.splice(currentCombination.length - 1, 1);
    }
  }
  getEntitiesByIds(entityIds: number[]): Entity[] {
    let resultEntities: Entity[] = [];
    entityIds.forEach(ei => {
      this.levels.forEach(l => {
        l.entities.forEach(e => {
          if (ei == e.id)
            resultEntities.push(e);
        });
      });
    });
    return resultEntities;
  }
  getSelectedCharacteristic(idLevel: number, idCharact: number): SelectedCharacteristic {
    for (var i = 0; i < this.selectedCharacteristics.length; i++) {
      if (this.selectedCharacteristics[i].selectedIdLevel == idLevel && this.selectedCharacteristics[i].selectedIdCharacteristic == idCharact)
        return this.selectedCharacteristics[i]
    }
  }

  getSelectedEntitiesByIdLevel(idLevel: number): SelectedEntityPerLevel {
    for (var i = 0; i < this.selectedEntities.length; i++) {
      var levelEntities = this.selectedEntities[i];
      if (levelEntities.length > 0)
        if (levelEntities[0].idLevel == idLevel) {
          levelEntities.splice(1, levelEntities.length - 1);//trebuie sa ramana doar unul  
          return levelEntities[0];
        }
    }
  }
  isLevelEntitySelected(idLevel: number): boolean {
    for (var i = 0; i < this.selectedEntities.length; i++) {
      var levelEntities = this.selectedEntities[i];
      if (levelEntities.length > 0)
        if (levelEntities[0].idLevel == idLevel) {
          if (levelEntities[0].idEntity != -1)
            return true;
        }
    }
    return false;
  }
  doFilterEntities(idLevel: number, calledFromCharacteristicFilter: boolean) {
    this.resetSelectedCharacteristics(idLevel, false);

    if (!calledFromCharacteristicFilter) {
      //daca selectia de entitati e resetata se reseteaza si selectia de caracteristici
      let selEnts = this.selectedEntities.filter(e => e[0].idLevel == idLevel)[0];
      if (selEnts[0].idEntity == -1)
        this.resetSelectedCharacteristics(idLevel, true);
      ////
    }

    let filteredEntititesPerLevel = this.getFilteredEntitiesPerLevel();

    //le punem in obiectul legat la interfata
    for (let i = 0; i < filteredEntititesPerLevel.length; i++) {
      const filteredEntities = filteredEntititesPerLevel[i];
      for (let j = 0; j < this.filteredLevels.length; j++) {
        let level = this.filteredLevels[j];
        if (filteredEntities.length > 0)
          if (level.id == filteredEntities[0].idLevel)
            level.entities = filteredEntities;
      }
    }

    this.applyFilter();
  }

  doFilterEntitiesByCharacteristics(idLevel: number) {
    this.resetSelectedCharacteristics(idLevel, false);
    this.initFilteredEntities();//trebuie initializat si aici pentru ca altfel va incerca sa filtreze entiati deja filtrate si nu va gasi nimic
    let level = this.filteredLevels.filter(l => l.id == idLevel);
    let characteristicFilters = this.selectedCharacteristics.filter(c => c.selectedIdLevel == idLevel);

    let filteredEntities: Entity[] = [];

    for (let j = 0; j < level[0].entities.length; j++) {
      const entity = level[0].entities[j];

      let matchNo = 0;//trebuie sa se potriveasca toate caracteristicile din filtre(care sunt selectate, adica !="-1")
      break_level:
      for (let k = 0; k < entity.characteristics.length; k++) {

        for (let i = 0; i < characteristicFilters.length; i++) {
          const charactFilter = characteristicFilters[i];
          const charact = entity.characteristics[k];
          if (charact.id == charactFilter.selectedIdCharacteristic)
            if (charactFilter.selectedValue != "-1")  //All
            {
              if (charact.idFieldType == FieldType.Numeric) {
                let numericVal: string = charact.numericValue != null ? charact.numericValue.toString() : "";
                if (numericVal == charactFilter.selectedValue) {
                  matchNo++;
                }
              }
              else {
                if (charact.textValue_EN == charactFilter.selectedValue)//aici trebuie sa tina cont de cultura
                {
                  matchNo++;
                }
              }
            }

          if (matchNo == characteristicFilters.filter(cFlt => cFlt.selectedValue != "-1").length)//daca se potrivesc toate
          {
            filteredEntities.push(JSON.parse(JSON.stringify(entity)));
            break break_level;
          }
        }
      }
    }

    if (filteredEntities.length > 0)//daca s-au gasit entitati care sa se potriveasca
    {
      //punem entitatile filtrate in selected entitites si apelam metoda de filtrare de entitati
      for (var i = 0; i < this.selectedEntities.length; i++) {
        var levelEntities = this.selectedEntities[i];
        if (levelEntities.length > 0)
          if (levelEntities[0].idLevel == idLevel) {
            let currentIdLevelType = levelEntities[0].idLevelType
            levelEntities = [];
            for (let j = 0; j < filteredEntities.length; j++) {
              const fltEnt = filteredEntities[j];
              levelEntities.push(new SelectedEntityPerLevel(idLevel, fltEnt.id, currentIdLevelType));
            }
            this.selectedEntities[i] = levelEntities;
            //break;
          }
          else {
            //resetam toate selectiile de entitati de pe celelalte niveluri
            let entity = new SelectedEntityPerLevel(levelEntities[0].idLevel, -1, levelEntities[0].idLevelType);
            this.selectedEntities[i] = [entity];
          }
      }
      this.doFilterEntities(idLevel, true);

      this.initSelectedEntities();//dupa filtrarea pe baza caracteristicilor trebuie resetate selectiile
    }
    else//daca nu s-au gasit entitati se resteaza caracteristicile
    {
      this.resetSelectedCharacteristics(idLevel, true);
      this.showPageMessage('warn', 'Warning', 'No matches found!');
    }
  }

  isValidCombination(combination: Entity[]): boolean {
    let containsAll = true;

    for (let i = 0; i < this.selectedEntities.length; i++) {
      let isFound = false;
      let selectedEntitiesPerLevel = this.selectedEntities[i];
      level1:
      for (let x = 0; x < selectedEntitiesPerLevel.length; x++) {
        const selectedEntity = selectedEntitiesPerLevel[x];
        for (let j = 0; j < combination.length; j++) {
          if (selectedEntity.idEntity == combination[j].id || selectedEntity.idEntity == -1) {
            isFound = true;
            break level1;
          }
        }
      }

      if (!isFound) {
        containsAll = false;
        break;
      }
    }

    return containsAll;
  }
  getFilteredEntitiesPerLevel(): Entity[][] {
    let filteredEntitiesPerLevel: Entity[][] = []

    //filtram path-urile dupa selected entities(trebuie pastrate doar cele care contin toate entitatile selectate)
    let filteredCombinations: Entity[][] = [];
    for (let i = 0; i < this.allEntityCombinations.length; i++) {
      if (this.isValidCombination(this.allEntityCombinations[i]))
        filteredCombinations.push(this.allEntityCombinations[i]);
    }
    /////

    ////grupare per nivel
    if (filteredCombinations.length > 0) {
      let levelsNumber = this.getMaxDepth(filteredCombinations);

      for (let i = 0; i < levelsNumber; i++) {
        let levelEntitites: Entity[] = [];
        filteredCombinations.forEach(combination => {
          if (combination.length > i) {
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

  getMaxDepth(combinations: Entity[][]): number {
    if (combinations.length > 0) {
      let max = combinations[0].length;
      for (let i = 0; i < combinations.length; i++) {
        if (combinations[0].length > max)
          max = combinations[0].length;
      }
      return max;
    }
    else
      return 0;
  }
  resetFilters() {
    this.initSelectedEntities();
    this.initSelectedCharacteristics();
    this.initFilteredEntities();
    this.applyFilter();
  }
  generateBookingFilter(): BookingFilter {
    return new BookingFilter(this.filteredLevels, this.allEntityCombinations, this.selectedDate);
  }

  applyFilter() {
    let bookingFilter = this.generateBookingFilter();
    this.filterChanged.emit(bookingFilter);
  }
}
