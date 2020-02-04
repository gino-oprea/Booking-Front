import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BaseComponent } from '../base-component';
import { WebSites } from '../../enums/enums';

@Component({
  selector: 'bf-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent extends BaseComponent implements OnInit {

  @Input() events: CalendarEvent[] = [];
  @Output() dateClick = new EventEmitter<Date>();
  @Output() eventClick = new EventEmitter<CalendarEvent>();
  @Output() eventDrop = new EventEmitter<DropEventPayload>();

  currentDate: Date = new Date();
  dayNames_EN: string[];
  dayNames_RO: string[];
  dayDates: CalendarSlot[][];
  //weekNumbers: number[];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  calendarRowHeight: string;
  

  constructor(private injector: Injector)
  {
    super(injector, []);
    this.site = WebSites.Back;
    this.pageName = 'Full calendar';
  }

  ngOnInit()
  {
    this.dayNames_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    this.dayNames_RO = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"];
    this.dayDates = this.generateMonth();
    this.calendarRowHeight = this.getCalendarRowHeight();
  }

  getDateSlotEvent(dayNumber:number, monthNumber:number, yearNumber:number): CalendarEvent[]
  {
    let slotEvents: CalendarEvent[] = [];
    for (let i = 0; i < this.events.length; i++) 
    {
      const event = this.events[i];
      if (this.equalDates(new Date(event.start), this.getDateSlotDate(dayNumber,monthNumber,yearNumber)))
        slotEvents.push(event);
    }

    return slotEvents;
  }

  getDateSlotDate(dayNumber: number, monthNumber: number, yearNumber: number): Date
  {
    return new Date(yearNumber, monthNumber, dayNumber, 0, 0, 0, 0);
  }

  equalDates(date1: Date, date2: Date):boolean
  {
    if (date1.getFullYear() == date2.getFullYear()
      && date1.getMonth() == date2.getMonth()
      && date1.getDate() == date2.getDate())
      return true;
    else
      return false;
  }

  slotIsCurrentDate(dayNumber: number)
  {
    if (this.selectedYear == this.currentDate.getFullYear()
      && this.selectedMonth == this.currentDate.getMonth()
      && dayNumber == this.currentDate.getDate())
      return true;
    else
      return false;
  }
  getCalendarRowHeight():string
  {
    return Math.floor(100 / this.dayDates.length).toString()+'%';
  }

  btnChangeMonth(direction: string)
  {
    if (direction == "forward")
    {
      if (this.selectedMonth < 11)
        this.selectedMonth++;
      else
      {
        this.selectedMonth = 0;
        this.selectedYear++;
      }
    }
    else
    {
      if (this.selectedMonth > 0)
        this.selectedMonth--;
      else
      {
        this.selectedMonth = 11;
        this.selectedYear--;
      }
    }
    
    this.dayDates = this.generateMonth();
    this.calendarRowHeight = this.getCalendarRowHeight();
  }

  getPreviousMonthAndYear(): { month: number, year: number }
  {
    if (this.selectedMonth > 0)
      return { month: this.selectedMonth - 1, year: this.selectedYear };
    else
      return { month: 11, year: this.selectedYear - 1 };
  }
  getNextMonthAndYear(): { month: number, year: number }
  {
    if (this.selectedMonth < 11)
      return { month: this.selectedMonth + 1, year: this.selectedYear };
    else
      return { month: 0, year: this.selectedYear + 1 };
  }

  generateMonth():CalendarSlot[][]
  {
    let dates: CalendarSlot[][] = [];

    let date: Date = new Date(this.selectedYear, this.selectedMonth, 1, 0, 0, 0, 0);

    let firstDayAsWeekDay = date.getDay() == 0 ? 7 : date.getDay();
    let numberOfDaysInPreviousMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    let numberOfDaysInCurrentMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    let stop: boolean = false;
    let weekNumber: number = 0;
    let dayNumber: number = 0;
    while (!stop)
    {
      weekNumber++;
      let days:CalendarSlot[] = [];
      for (let j = 0; j < 7; j++) 
      {        
        if (weekNumber == 1)//prima saptamana
        {
          if ((j + 2) <= firstDayAsWeekDay)//pana am epuizat zilele din luna precedenta
            days.push(
              {
                dateNumber: numberOfDaysInPreviousMonth - (firstDayAsWeekDay - (j + 2)),
                monthNumber: this.getPreviousMonthAndYear().month,
                yearNumber: this.getPreviousMonthAndYear().year,
                isCurrentMonth: false
              });
          else
          {
            dayNumber++;
            days.push({ dateNumber: dayNumber, monthNumber:this.selectedMonth, yearNumber:this.selectedYear, isCurrentMonth: true });
          }
        }
        else
        {
          dayNumber++;

          if (dayNumber <= numberOfDaysInCurrentMonth)
            days.push({
              dateNumber: dayNumber,
              monthNumber: !stop? this.selectedMonth : this.getNextMonthAndYear().month,
              yearNumber: !stop? this.selectedYear : this.getNextMonthAndYear().year,
              isCurrentMonth: !stop
            });
          else
          {
            stop = true;
            dayNumber = 1;//incepem de pe 1 luna urmatoare
            days.push({
              dateNumber: dayNumber,
              monthNumber: this.getNextMonthAndYear().month,
              yearNumber: this.getNextMonthAndYear().year,
              isCurrentMonth: !stop
            });
          }
        }
      }
      dates.push(days);
    }    
    return dates;
  }  

  getSlotIdsAsString():string[]
  {
    let ids: string[] = [];
    for (let i = 0; i < this.dayDates.length; i++) 
    {
      let week = this.dayDates[i];
      for (let j = 0; j < week.length; j++) 
      {
        let day = week[j];
        let id = day.yearNumber.toString() + "-" + (day.monthNumber + 1).toString() + "-" + day.dateNumber.toString();
        ids.push(id);
      }
    }

    return ids;
  }

  getMonthName()
  {
    const monthNames_EN = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];  
    const monthNames_RO = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];  
    return this.currentCulture == 'EN' ? monthNames_EN[this.selectedMonth] : monthNames_RO[this.selectedMonth];
  }
  getDayNames():string[]
  {
    return this.currentCulture == 'EN' ? this.dayNames_EN : this.dayNames_RO;
  } 

  timeSlotClick(calendarSlot: CalendarSlot)
  {
    let selectedDateSlot: Date = new Date(calendarSlot.yearNumber, calendarSlot.monthNumber, calendarSlot.dateNumber, 0, 0, 0, 0);
    this.dateClick.emit(selectedDateSlot);
  }
  onEventClick(event: CalendarEvent)
  {
    this.eventClick.emit(event);
  }
  onEventDrop(event: CdkDragDrop<string[]>)
  {    
    let draggedEvent = <CalendarEvent>event.item.data;    
    let ev = this.events.find(ev => ev.id == draggedEvent.id);
    let newStartDate = event.container.id;
    ev.start = newStartDate;
    this.dayDates = this.generateMonth();

    let eventPayload: DropEventPayload = {
      event: ev,
      originDate: event.previousContainer.id,
      targetDate: event.container.id
    }

    this.eventDrop.emit(eventPayload);
  }
}

class DropEventPayload
{
  constructor(
    public event: CalendarEvent,
    public originDate: string,
    public targetDate: string,
  ) { }
}

class CalendarSlot
{
  constructor(
    public dateNumber: number,
    public monthNumber: number,
    public yearNumber: number,
    public isCurrentMonth:boolean
  ) { }
}

class CalendarEvent
{
  constructor(
    public id?: string,
    public title?: string,
    public allDay?: boolean,
    public start?: string,
    public color?: string
  ) { }
}

