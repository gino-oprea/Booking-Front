import { Component, OnInit, OnChanges, Input, EventEmitter, Output, Injector, SimpleChanges, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base-component';
import { WorkingHours } from '../../objects/working-hours';
import { WorkingDay } from '../../objects/working-day';
import { BookingService } from '../../app-services/booking.service';
import { Actions, WebSites } from '../../enums/enums';
import { BookingFilter } from 'app/objects/booking-filter';
import { Booking } from '../../objects/booking';
import { LevelAsFilter } from '../../objects/level-as-filter';
import { Timeslot } from '../../objects/timeslot';
import { SelectBookingHourTransferObject } from '../../company-booking/select-booking-hour-transfer-object';
import { CommonServiceMethods } from '../../app-services/common-service-methods';
import { BookingSearchFilter } from '../../objects/booking-search-filter';
import { NavigationStart } from '@angular/router';

export enum WeekShiftType
{
  Right = 1,
  Left = -1
}

@Component({
  selector: 'bf-booking-hours',
  templateUrl: './booking-hours.component.html',
  styleUrls: ['./booking-hours.component.css']
})
export class BookingHoursComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy
{
  @Input() idCompany: number;
  @Input() selectedFilter = new BookingFilter();
  @Input() bookingSearchFilter: BookingSearchFilter;
  @Input() allowFullCalendarNavigation: boolean = false;

  workingHoursBounds: WorkingHours = null;
  //@Output() selectTimeSlot = new EventEmitter<WorkingDay>();
  @Output() selectTimeSlot = new EventEmitter<SelectBookingHourTransferObject>();
  @Output() selectDate = new EventEmitter<Date>();

  shiftedDate: Date = new Date();
  workingHours: WorkingHours = null;
  hoursMatrix: Timeslot[][][] = [];
  dayNames: any[];
  dayDates: Date[];

  refreshInterval;

  isFirstLoad: boolean = true;

  commonMethods: CommonServiceMethods = new CommonServiceMethods();

  constructor(private injector: Injector,
    private bookingService: BookingService)
  {
    super(injector, [
      'lblMonday', 'lblTuesday', 'lblWednesday', 'lblThursday', 'lblFriday', 'lblSaturday', 'lblSunday'
    ]);

    this.site = WebSites.Front;
    this.pageName = 'Company booking';    

    this.dayNames = ['lblMonday', 'lblTuesday', 'lblWednesday', 'lblThursday', 'lblFriday', 'lblSaturday', 'lblSunday'];
    this.dayDates = [null, null, null, null, null, null, null];    
  }

  ngOnInit() 
  {
    
  }
  ngOnDestroy(): void 
  {
    clearInterval(this.refreshInterval);
    this.refreshInterval = null;
  }
  ngOnChanges(changes: SimpleChanges): void 
  {
    if (this.idCompany)
    {
      if (this.workingHours == null)
      {
        this.workingHours = new WorkingHours(0, this.idCompany, '',
          new WorkingDay('', null),
          new WorkingDay('', null),
          new WorkingDay('', null),
          new WorkingDay('', null),
          new WorkingDay('', null),
          new WorkingDay('', null),
          new WorkingDay('', null));
      }


      if (this.selectedFilter != null)
      {
        if (typeof (this.selectedFilter.date) == "string")
          this.selectedFilter.date = new Date(this.selectedFilter.date);

        if (this.isValidDate(this.selectedFilter.date))
        {
          this.shiftedDate = this.selectedFilter.date;
          this.assignCalendarDateForBookingHours(this.shiftedDate);
          this.setDayDates();
          this.getHoursMatrix();

          if (!this.refreshInterval)
            this.refreshInterval = setInterval(() => { this.refreshMatrix() }, 20000);
        }
      }
    }
  }

  refreshMatrix()
  {
    this.setDayDates();
    this.getHoursMatrix();
  }

  getHoursMatrix()
  {
    let weekDates = [];
    weekDates.push(this.getDateString(this.workingHours.monday.date));
    weekDates.push(this.getDateString(this.workingHours.tuesday.date));
    weekDates.push(this.getDateString(this.workingHours.wednesday.date));
    weekDates.push(this.getDateString(this.workingHours.thursday.date));
    weekDates.push(this.getDateString(this.workingHours.friday.date));
    weekDates.push(this.getDateString(this.workingHours.saturday.date));
    weekDates.push(this.getDateString(this.workingHours.sunday.date));

    this.bookingService.setUpBookingFilterEntitiesWorkingHours(this.idCompany, weekDates,
      this.selectedFilter.filteredLevels).subscribe(gro =>//call-ul asta se foloseste pentru autoassign - cand se face shift week
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.selectedFilter.filteredLevels = <LevelAsFilter[]>gro.objList;

        this.bookingService.generateHoursMatrix(this.idCompany, weekDates, this.selectedFilter.filteredLevels, this.bookingSearchFilter).subscribe(gro =>
        {
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);            
          }
          else
          {
            if (gro.objList.length > 0)
            {
              this.hoursMatrix = <Timeslot[][][]>gro.objList;                  
              
              if (this.hoursMatrix.find(ttt => ttt.find(tt => tt.find(t => t.isSelectable)!=null)!=null) == null && this.isFirstLoad)
              {
                this.isFirstLoad = false;
                this.shiftWeek(WeekShiftType.Right)
              }
            }
          }
        });
      }
    });
  }

  getTimeslotValueAsString(timeslot: Timeslot): string
  {
    let h = new Date(timeslot.startTime).getHours().toString().length < 2 ? '0' + new Date(timeslot.startTime).getHours().toString() : new Date(timeslot.startTime).getHours().toString();
    let m = new Date(timeslot.startTime).getMinutes().toString().length < 2 ? '0' + new Date(timeslot.startTime).getMinutes().toString() : new Date(timeslot.startTime).getMinutes().toString();
    let val: string = h + ':' + m;

    return val;
  }

  getDateString(date: Date)
  {
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();

    var dateString = year + "-" + month + "-" + day;
    return dateString;
  }

  setDayDates()
  {
    if (this.workingHours != null)
    {
      this.dayDates = [this.workingHours.monday.date,
      this.workingHours.tuesday.date,
      this.workingHours.wednesday.date,
      this.workingHours.thursday.date,
      this.workingHours.friday.date,
      this.workingHours.saturday.date,
      this.workingHours.sunday.date];
    }
  }
  shiftWeek(type: WeekShiftType)
  {
    let newDate: Date = new Date(this.shiftedDate.getTime());

    if (type == WeekShiftType.Right)
    {
      newDate.setDate(this.shiftedDate.getDate() + 7);
      if (!this.isValidDate(newDate))
        newDate = null;
    }
    else
    {
      newDate.setDate(this.shiftedDate.getDate() - 7);
      if (!this.isValidDate(newDate))
        newDate = null;
    }

    if (newDate != null)
    {
      this.selectDate.emit(newDate);
      this.shiftedDate = newDate;
      this.assignCalendarDateForBookingHours(this.shiftedDate);
      this.setDayDates();

      this.getHoursMatrix();
    }
  }

  activateTimeSlot(dayIndex: number, hourRowIndex: number, timeSlotIndex: number)
  {
    if (
      (this.hoursMatrix[dayIndex][hourRowIndex][timeSlotIndex].isSelectable &&
        !this.hoursMatrix[dayIndex][hourRowIndex][timeSlotIndex].isFullBooked)
      || (this.hoursMatrix[dayIndex][hourRowIndex][timeSlotIndex].isSelectable &&
        this.hoursMatrix[dayIndex][hourRowIndex][timeSlotIndex].isFullBooked && this.allowFullCalendarNavigation)
    ) 
    {
      this.unselectAllWorkingHours();
      this.hoursMatrix[dayIndex][hourRowIndex][timeSlotIndex].isSelected = true;
      this.generateWorkingHoursIntervals();

      let workingDayToEmit = new WorkingDay("", null);
      for (let wDay in this.workingHours) 
      {
        if (this.workingHours[wDay] instanceof WorkingDay)
          if (this.workingHours[wDay].workHours != "")  
          {
            workingDayToEmit = this.workingHours[wDay];
            break;
          }
      }

      let obj: SelectBookingHourTransferObject = new SelectBookingHourTransferObject();
      obj.workingDay = workingDayToEmit;
      obj.bookingDayTimeslots = this.hoursMatrix[dayIndex];
      this.selectTimeSlot.emit(obj);
    }
  }
  unselectAllWorkingHours()
  {
    for (var i = 0; i < this.hoursMatrix.length; i++) 
    {
      for (var j = 0; j < this.hoursMatrix[i].length; j++) 
      {
        for (var x = 0; x < this.hoursMatrix[i][j].length; x++) 
        {
          this.hoursMatrix[i][j][x].isSelected = false;
        }
      }
    }
  }
  generateWorkingHoursIntervals()//pentru salvare
  {
    for (var i = 0; i < this.hoursMatrix.length; i++) 
    {
      let intervalsString = '';
      let startRecordingInterval = false;
      for (var j = 0; j < this.hoursMatrix[i].length; j++) 
      {
        for (var x = 0; x < this.hoursMatrix[i][j].length; x++) 
        {
          if (this.hoursMatrix[i][j][x].isSelected)
          {
            intervalsString += '[' + this.getTimeslotValueAsString(this.hoursMatrix[i][j][x]) + ',' + this.getTimeslotValueAsString(this.hoursMatrix[i][j][x]) + ']';
          }
        }
      }
      if (i == 0) { this.workingHours.monday.workHours = intervalsString; }
      if (i == 1) { this.workingHours.tuesday.workHours = intervalsString; }
      if (i == 2) { this.workingHours.wednesday.workHours = intervalsString; }
      if (i == 3) { this.workingHours.thursday.workHours = intervalsString; }
      if (i == 4) { this.workingHours.friday.workHours = intervalsString; }
      if (i == 5) { this.workingHours.saturday.workHours = intervalsString; }
      if (i == 6) { this.workingHours.sunday.workHours = intervalsString; }
    }
  }
  assignCalendarDateForBookingHours(selDate: Date)
  {
    let weekDay = selDate.getDay();

    let mondayDate = new Date(selDate.getTime());
    let tuesdayDate = new Date(selDate.getTime());
    let wednesdayDate = new Date(selDate.getTime());
    let thursdayDate = new Date(selDate.getTime());
    let fridayDate = new Date(selDate.getTime());
    let saturdayDate = new Date(selDate.getTime());
    let sundayDate = new Date(selDate.getTime());

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

    this.workingHours.monday.date = mondayDate;
    this.workingHours.monday.date.setHours(0, 0, 0, 0);

    this.workingHours.tuesday.date = tuesdayDate;
    this.workingHours.tuesday.date.setHours(0, 0, 0, 0);

    this.workingHours.wednesday.date = wednesdayDate;
    this.workingHours.wednesday.date.setHours(0, 0, 0, 0);

    this.workingHours.thursday.date = thursdayDate;
    this.workingHours.thursday.date.setHours(0, 0, 0, 0);

    this.workingHours.friday.date = fridayDate;
    this.workingHours.friday.date.setHours(0, 0, 0, 0);

    this.workingHours.saturday.date = saturdayDate;
    this.workingHours.saturday.date.setHours(0, 0, 0, 0);

    this.workingHours.sunday.date = sundayDate;
    this.workingHours.sunday.date.setHours(0, 0, 0, 0);
  }
  isValidDate(selDate: Date)
  {
    if (!this.allowFullCalendarNavigation)
    {
      let today = new Date();
      let weekDay = selDate.getDay();
      let sundayDate = new Date(selDate.getTime());

      if (weekDay != 0)//nu duminica        
        sundayDate.setDate(sundayDate.getDate() + (7 - weekDay));
      else//duminica          
        sundayDate.setDate(sundayDate.getDate());


      today.setHours(0, 0, 0, 0);
      sundayDate.setHours(0, 0, 0, 0);
      if (today.getTime() <= sundayDate.getTime())
        return true;
      else
        return false;
    }
    else
      return true;
  }
}
