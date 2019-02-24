//import { EntityWithLevel } from '../objects/entity-with-level';
import { EntitiesService } from '../app-services/entities.service';
import { duration } from 'moment';
import { BookingDefaultDuration } from '../objects/booking-default-duration';


import { BookingService } from '../app-services/booking.service';
import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { Actions, DurationType, FieldType, LevelType, WebSites, MessageType } from '../enums/enums';
import { GenericResponseObject } from '../objects/generic-response-object';
import { WorkingHours } from '../objects/working-hours';
import { WorkingDay } from '../objects/working-day';

import { BookingFilter } from 'app/objects/booking-filter';
import { SelectBookingHourTransferObject } from './select-booking-hour-transfer-object';
import { AutoAssignedEntityCombination } from '../objects/auto-assigned-entity-combination';
import { CommonServiceMethods } from '../app-services/common-service-methods';
import { AutoAssignPayload } from '../objects/auto-assign-payload';
import { PotentialBooking } from '../objects/potential-booking';
import { BookingEntity } from '../objects/booking-entity';
import { Message } from '../objects/message';

@Component({
  selector: 'bf-company-booking',
  templateUrl: './company-booking.component.html',
  styleUrls: ['./company-booking.component.css']
})
export class CompanyBookingComponent extends BaseComponent implements OnInit {
  companyName: string = '';
  bookingDefaultDuration: BookingDefaultDuration;
  showCalendarBooking: boolean;
  selectedFilter: BookingFilter;// = new BookingFilter(null, null, new Date());
  shiftedDate: Date = new Date();
  displayDialogConfirmBooking: boolean = false;
  selectedBookingHourTransferObject: SelectBookingHourTransferObject;// = new SelectBookingHourTransferObject(new WorkingDay('', new Date()), []);
  autoAssignedEntityCombination: AutoAssignedEntityCombination;
  //entitiesWithLevel: EntityWithLevel[];



  constructor(private injector: Injector,
    private bookingService: BookingService,
    private entitiesService: EntitiesService) {
    super(injector, []);
    this.site = WebSites.Front;
    this.pageName = 'Company booking';

    this.routeSubscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.idCompany = +params['id'];
      }
      if (params.hasOwnProperty('companyname')) {
        this.companyName = params['companyname'];
      }
    });
  }

  ngOnInit() {
    this.logAction(this.idCompany, false, Actions.View, "", "");

    this.getBookingDefaultDuration();
  }
  getBookingDefaultDuration() {
    this.bookingService.getBookingDefaultDuration(this.idCompany).subscribe(result => {
      let gro = <GenericResponseObject>result;
      if (gro.error != '') {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else {
        if (gro.objList.length > 0) {
          this.bookingDefaultDuration = <BookingDefaultDuration>gro.objList[0];
          this.calculateDefaultDuration();
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting levels', ''));
  }
  calculateDefaultDuration() {
    let duration = this.bookingDefaultDuration.defaultDuration;
    let durType = this.bookingDefaultDuration.durationType;

    if (durType == DurationType.Hours || durType == DurationType.Minutes) {
      this.showCalendarBooking = false;
    }
    else {
      this.showCalendarBooking = true;
    }
  }


  filterChanged(value: BookingFilter) {
    this.selectedFilter = new BookingFilter(value.filteredLevels, value.allEntitiesPossibleCombinations, value.date);
  }
  bookingSaved(msg: Message) {
    if (msg.type == MessageType.Error)
      this.showPageMessage('error', 'Error', msg.value);
    if (msg.type == MessageType.Warning)
      this.showPageMessage('warn', 'Warning', msg.value);
    if (msg.type == MessageType.Success)
      this.showPageMessage('success', 'Success', msg.value);

    this.displayDialogConfirmBooking = false;
    this.selectedFilter = JSON.parse(JSON.stringify(this.selectedFilter));//this triggers onChanges in booking-hours component
  }
  onSelectBookingHour(value: SelectBookingHourTransferObject) {
    this.selectedBookingHourTransferObject = value//JSON.parse(JSON.stringify(value));
    this.getAutoAssignedEntities();
  }
  onShiftWeek(value: Date) {
    this.selectedFilter.date = value;
    this.shiftedDate = value;
  }

  getAutoAssignedEntities() {
    if (this.selectedBookingHourTransferObject.workingDay.workHours != "") {
      //console.log(this.selectedBookingHourTransferObject.bookingDayTimeslots);
      let startTime: string = "";
      let selectedTime = this.selectedBookingHourTransferObject.workingDay.workHours.split(',')[0].substring(1);//eliminam paranteza patrata de la inceput    
      let h = selectedTime.split(':')[0];
      let m = selectedTime.split(':')[1];
      startTime = h + ":" + m;


      let bookingDate = CommonServiceMethods.getDateString(new Date(this.selectedBookingHourTransferObject.workingDay.date));
      let autoAssignPayload = new AutoAssignPayload(this.selectedFilter.filteredLevels, this.selectedBookingHourTransferObject.bookingDayTimeslots);

      this.bookingService.autoAssignEntitiesToBooking(this.idCompany, bookingDate, startTime, autoAssignPayload).subscribe(gro => {
        if (gro.error != '') {
          this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed);
          this.showPageMessage('error', 'Error', gro.error);
        }
        else {
          this.logAction(this.idCompany, false, Actions.Add, '', 'auto assign booking');
          if (gro.objList != null) {
            this.autoAssignedEntityCombination = <AutoAssignedEntityCombination>gro.objList[0];
            this.displayDialogConfirmBooking = true;
          }
          else
            this.showPageMessage("warn", "Warning", 'Selected combination duration does not fit in the remaining timeslots! Please select another timeslot!');
        }
      },
        err => {
          this.logAction(this.idCompany, true, Actions.Add, 'http error auto assign booking', err.status + ' ' + err.statusText);
          this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
        });
    }
  }
  onCloseConfirmDialog() {
    //let idEntities: number[] = this.autoAssignedEntityCombination.entityCombination.map(e => e.id);

    let startTime: Date;
    let selectedTime = this.selectedBookingHourTransferObject.workingDay.workHours.split(',')[0].substring(1);//eliminam paranteza patrata de la inceput    
    let h = selectedTime.split(':')[0];
    let m = selectedTime.split(':')[1];

    let date = new Date(this.selectedBookingHourTransferObject.workingDay.date);
    startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(h), parseInt(m), 0, 0);

    let bookingEntities: BookingEntity[] = [];
    this.autoAssignedEntityCombination.entityCombination.forEach(e => {
      bookingEntities.push(new BookingEntity(e.id, false, e.idLevel, e.isMultipleBooking));
    });

    let potentialBooking: PotentialBooking = new PotentialBooking(null, this.idCompany, bookingEntities, null,
      CommonServiceMethods.getDateTimeString(date), null,
      CommonServiceMethods.getDateTimeString(startTime), null, null);

    if (this.autoAssignedEntityCombination.idPotentialBooking != null) {
      this.bookingService.removePotentialBooking(this.autoAssignedEntityCombination.idPotentialBooking).subscribe(result => {
        let gro = <GenericResponseObject>result;
        if (gro.error != '') {
          console.log(gro);
          this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed);
        }
        else {
          console.log('potential booking removed from server singleton')
        }
      },
        err => this.logAction(this.idCompany, true, Actions.Search, 'http error removing potential booking from server singleton', ''));
    }
  }
}
