import { Component, Injector, Input, OnChanges, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { WorkingHours } from '../../../objects/working-hours';
import { BaseComponent } from '../../../shared/base-component';
import { HoursMatrixService } from '../../../app-services/hours-matrix.service';
import { Timeslot } from '../../../objects/timeslot';
import { WebSites } from '../../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceMethods } from '../../../app-services/common-service-methods';

@Component({
  selector: 'bf-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.css']  
})
export class WorkingHoursComponent extends BaseComponent implements OnInit, OnChanges
{
  @Input() singleDay: number = -1;//indexul zilei care vrem sa se genereze, daca e -1 se genereaza toata saptamana
  @Input() workingHours: WorkingHours = null;
  @Input() workingHoursBounds: WorkingHours = null;
  @Input() disabled: boolean = false;
  @Output() selectTimeSlot = new EventEmitter<WorkingHours>();

  differ: any;
  hoursMatrix: any[] = [];
  dayNames: any[];
  dayDates: Date[];
  dayOff: any[];

  commonMethods: CommonServiceMethods = new CommonServiceMethods(); 
  
  constructor(private injector: Injector, private hoursMatrixService:HoursMatrixService)
  {
    super(injector, [
      'lblMonday', 'lblTuesday', 'lblWednesday', 'lblThursday', 'lblFriday', 'lblSaturday', 'lblSunday'
    ]);

    this.site = WebSites.Back;
    this.pageName = 'Working Hours';

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
      
    this.dayNames = ['lblMonday', 'lblTuesday', 'lblWednesday', 'lblThursday', 'lblFriday', 'lblSaturday', 'lblSunday'];
    this.dayDates = [null, null, null, null, null, null, null];
    
    this.dayOff = [false, false, false, false, false, false, false];
  }

  ngOnInit() 
  {
    //this.generateHoursMatrix();
  }
  ngOnChanges(changes: SimpleChanges): void 
  {
    //if (changes['workingHours'])
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

      this.generateHoursMatrix();
    }     
  }  
  generateHoursMatrix()
  {
    var workingHoursAndBounds: WorkingHours[] = [this.workingHours, this.workingHoursBounds];
    this.hoursMatrixService.generateHoursMatrix(this.idCompany, this.singleDay, workingHoursAndBounds).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.hoursMatrix = <Timeslot[][][]>gro.objList;

          for (let i = 0; i < this.dayOff.length; i++) 
          {
            this.dayOff[i] = true;            
          }
          

          this.autoToggleDayOff();
        }
      }
    },
      err => console.log(err));
  }
  // generateHoursMatrix()
  // {
  //   let days = 7;
  //   if (this.singleDay != -1)
  //     days = 1;

  //   let hourlyIntervals = 2;
  //   let intervalsPerDay = 24 * hourlyIntervals;

  //   this.hoursMatrix = [];    
  //   for (var i = 0; i < days; i++)
  //   {
  //     let hoursIntervalsString = '';
  //     let hoursIntervalBoundsString = '';

  //     if (this.workingHoursBounds != null)
  //     {
  //       if (this.singleDay == -1)
  //       {
  //         if (i == 0) { hoursIntervalBoundsString = this.workingHoursBounds.monday.workHours }
  //         if (i == 1) { hoursIntervalBoundsString = this.workingHoursBounds.tuesday.workHours }
  //         if (i == 2) { hoursIntervalBoundsString = this.workingHoursBounds.wednesday.workHours }
  //         if (i == 3) { hoursIntervalBoundsString = this.workingHoursBounds.thursday.workHours }
  //         if (i == 4) { hoursIntervalBoundsString = this.workingHoursBounds.friday.workHours }
  //         if (i == 5) { hoursIntervalBoundsString = this.workingHoursBounds.saturday.workHours }
  //         if (i == 6) { hoursIntervalBoundsString = this.workingHoursBounds.sunday.workHours }
  //       }
  //       else
  //       {
  //         if (this.singleDay == 0) { hoursIntervalBoundsString = this.workingHoursBounds.monday.workHours }
  //         if (this.singleDay == 1) { hoursIntervalBoundsString = this.workingHoursBounds.tuesday.workHours }
  //         if (this.singleDay == 2) { hoursIntervalBoundsString = this.workingHoursBounds.wednesday.workHours }
  //         if (this.singleDay == 3) { hoursIntervalBoundsString = this.workingHoursBounds.thursday.workHours }
  //         if (this.singleDay == 4) { hoursIntervalBoundsString = this.workingHoursBounds.friday.workHours }
  //         if (this.singleDay == 5) { hoursIntervalBoundsString = this.workingHoursBounds.saturday.workHours }
  //         if (this.singleDay == 6) { hoursIntervalBoundsString = this.workingHoursBounds.sunday.workHours }
  //       }  
  //     }

  //     if (this.workingHours != null)
  //     {
  //       if (this.singleDay == -1)
  //       {
  //         if (i == 0) { hoursIntervalsString = this.workingHours.monday.workHours }
  //         if (i == 1) { hoursIntervalsString = this.workingHours.tuesday.workHours }
  //         if (i == 2) { hoursIntervalsString = this.workingHours.wednesday.workHours }
  //         if (i == 3) { hoursIntervalsString = this.workingHours.thursday.workHours }
  //         if (i == 4) { hoursIntervalsString = this.workingHours.friday.workHours }
  //         if (i == 5) { hoursIntervalsString = this.workingHours.saturday.workHours }
  //         if (i == 6) { hoursIntervalsString = this.workingHours.sunday.workHours }
  //       }
  //       else
  //       {
  //         if (this.singleDay == 0) { hoursIntervalsString = this.workingHours.monday.workHours }
  //         if (this.singleDay == 1) { hoursIntervalsString = this.workingHours.tuesday.workHours }
  //         if (this.singleDay == 2) { hoursIntervalsString = this.workingHours.wednesday.workHours }
  //         if (this.singleDay == 3) { hoursIntervalsString = this.workingHours.thursday.workHours }
  //         if (this.singleDay == 4) { hoursIntervalsString = this.workingHours.friday.workHours }
  //         if (this.singleDay == 5) { hoursIntervalsString = this.workingHours.saturday.workHours }
  //         if (this.singleDay == 6) { hoursIntervalsString = this.workingHours.sunday.workHours }
  //       }
  //     }

  //     this.hoursMatrix[i] = [];

  //     let currentHourIteration = new Date();
  //     currentHourIteration.setHours(0, 0, 0, 0);
     
  //     this.dayOff[i] = true;

  //     for (var j = 0; j < 24; j++)
  //     {
  //       this.hoursMatrix[i][j] = [];
        
  //       let h = currentHourIteration.getHours().toString().length < 2 ? '0' + currentHourIteration.getHours().toString() : currentHourIteration.getHours().toString();
  //       let m = currentHourIteration.getMinutes().toString().length < 2 ? '0' + currentHourIteration.getMinutes().toString() : currentHourIteration.getMinutes().toString();

  //       let timeSlotObj1: any = new Object();
  //       timeSlotObj1.val = h + ':' + m;

  //       timeSlotObj1.isSelectable = true;
  //       if (this.workingHoursBounds != null)
  //         timeSlotObj1.isSelectable = this.checkTimeSlotInsideInterval(timeSlotObj1.val, hoursIntervalBoundsString);        

  //       if (timeSlotObj1.isSelectable)
  //         timeSlotObj1.isSelected = this.checkTimeSlotInsideInterval(timeSlotObj1.val, hoursIntervalsString);
  //       else
  //         timeSlotObj1.isSelected = false;  

  //       this.hoursMatrix[i][j].push(timeSlotObj1);
  //       currentHourIteration.setMinutes(currentHourIteration.getMinutes() + 30);
        
  //       h = currentHourIteration.getHours().toString().length < 2 ? '0' + currentHourIteration.getHours().toString() : currentHourIteration.getHours().toString();
  //       m = currentHourIteration.getMinutes().toString().length < 2 ? '0' + currentHourIteration.getMinutes().toString() : currentHourIteration.getMinutes().toString();

  //       let timeSlotObj2: any = new Object();
  //       timeSlotObj2.val = h + ':' + m;

  //       timeSlotObj2.isSelectable = true;
  //       if (this.workingHoursBounds != null)
  //         timeSlotObj2.isSelectable = this.checkTimeSlotInsideInterval(timeSlotObj2.val, hoursIntervalBoundsString);

  //       if (timeSlotObj2.isSelectable)
  //         timeSlotObj2.isSelected = this.checkTimeSlotInsideInterval(timeSlotObj2.val, hoursIntervalsString);
  //       else
  //         timeSlotObj2.isSelected = false;  

  //       this.hoursMatrix[i][j].push(timeSlotObj2);
  //       currentHourIteration.setMinutes(currentHourIteration.getMinutes() + 30);
  //     }
  //   }
  //   this.autoToggleDayOff();
  // }
  // checkTimeSlotInsideInterval(timeSlot: string, intervalsString: string)//pentru aducerea datelor din DB si afisare
  // {
  //   let isSelected = false;
  //   let intervals = intervalsString.split(';');
  //   if (intervalsString != '')
  //   {
  //     for (var i = 0; i < intervals.length; i++)
  //     {
  //       let intervalStart = intervals[i].split(',')[0].substring(1);//eliminam paranteza patrata de la inceput
  //       let intervalEnd = intervals[i].split(',')[1].substring(0, intervals[i].split(',')[1].length - 2);//eliminam paranteza patrata de la sfarsit
      
  //       let dateStart = new Date('2000-01-01 ' + intervalStart + ':00');
  //       let dateEnd = new Date('2000-01-01 ' + intervalEnd + ':00');
      
  //       let timeToCheck = new Date('2000-01-01 ' + timeSlot + ':00');

  //       if (timeToCheck.getTime() >= dateStart.getTime() &&
  //         timeToCheck.getTime() < dateEnd.getTime())//trebuie sa fie mai mic strict decat finalul intervalului din cauza felului cum sunt gandite sloturile
  //       {
  //         isSelected = true;
  //         break;
  //       }
  //     }
  //   }  
  //   return isSelected;
  // }
  activateTimeSlot(dayIndex: number, hourRowIndex: number, timeslotIndex: number)
  {
    if (!this.disabled && this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelectable)
    {
      //alert(this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].val.toString());
      if (!this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected)
        this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected = true;
      else
        this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected = false;

      this.generateWorkingHoursIntervals();
      //console.log(this.workingHours);

      this.autoToggleDayOff();

      this.selectTimeSlot.emit(this.workingHours);
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
            if (startRecordingInterval == false)//punct de inflexiune
            {
              if (intervalsString != '')
                intervalsString += ';';
              
              intervalsString += '[' + this.getTimeslotValueAsString(this.hoursMatrix[i][j][x]) + ',';

              if (j == this.hoursMatrix[i].length - 1 && x == this.hoursMatrix[i][j].length - 1)//daca e ultimul slot
              {
                //daca e ultimul slot capatul de interval trebuie sa fie primul din matrice
                intervalsString += this.getTimeslotValueAsString(this.hoursMatrix[i][0][0]) + ']';
              }
            }
            else
            {
              if (j == this.hoursMatrix[i].length - 1 && x == this.hoursMatrix[i][j].length - 1)//daca e ultimul slot
              {
                //daca e ultimul slot capatul de interval trebuie sa fie primul din matrice
                intervalsString += this.getTimeslotValueAsString(this.hoursMatrix[i][0][0]) + ']';
              }
            }
            
            startRecordingInterval = true;
          }
          else
          {
            if (startRecordingInterval == true)//punct de inflexiune
            {
              intervalsString += this.getTimeslotValueAsString(this.hoursMatrix[i][j][x]) + ']';
            }

            startRecordingInterval = false;
          }
        }
      }
      if (this.singleDay == -1)
      {
        if (i == 0) { this.workingHours.monday.workHours = intervalsString; }
        if (i == 1) { this.workingHours.tuesday.workHours = intervalsString; }
        if (i == 2) { this.workingHours.wednesday.workHours = intervalsString; }
        if (i == 3) { this.workingHours.thursday.workHours = intervalsString; }
        if (i == 4) { this.workingHours.friday.workHours = intervalsString; }
        if (i == 5) { this.workingHours.saturday.workHours = intervalsString; }
        if (i == 6) { this.workingHours.sunday.workHours = intervalsString; }
      }
      else
      {
        if (this.singleDay == 0) { this.workingHours.monday.workHours = intervalsString; }
        if (this.singleDay == 1) { this.workingHours.tuesday.workHours = intervalsString; }
        if (this.singleDay == 2) { this.workingHours.wednesday.workHours = intervalsString; }
        if (this.singleDay == 3) { this.workingHours.thursday.workHours = intervalsString; }
        if (this.singleDay == 4) { this.workingHours.friday.workHours = intervalsString; }
        if (this.singleDay == 5) { this.workingHours.saturday.workHours = intervalsString; }
        if (this.singleDay == 6) { this.workingHours.sunday.workHours = intervalsString; }
      }
    }
  }

  autoToggleDayOff()
  {
    for (var i = 0; i < this.hoursMatrix.length; i++) 
    {
      let isAnySlotActive = false;
      for (var j = 0; j < this.hoursMatrix[i].length; j++) 
      {
        for (var x = 0; x < this.hoursMatrix[i][j].length; x++) 
        {
          if (this.hoursMatrix[i][j][x].isSelected)
            isAnySlotActive = true;  
        }
      }
      if (isAnySlotActive)
        this.dayOff[i] = false;
      else
        this.dayOff[i] = true;  
    } 
  }
  onSetDayOff(e, index)
  {
    if (e.checked)
    {
      this.dayOff[index] = true;
     
      for (var j = 0; j < this.hoursMatrix[index].length; j++) 
      {
        for (var x = 0; x < this.hoursMatrix[index][j].length; x++) 
        {
          this.hoursMatrix[index][j][x].isSelected = false;
        }
      }

      this.generateWorkingHoursIntervals();
    }
    else
    {
      if (this.singleDay == -1)
      {
        if (index == 0) { this.workingHours.monday.workHours = '[8:00,21:00]' }
        if (index == 1) { this.workingHours.tuesday.workHours = '[8:00,21:00]' }
        if (index == 2) { this.workingHours.wednesday.workHours = '[8:00,21:00]' }
        if (index == 3) { this.workingHours.thursday.workHours = '[8:00,21:00]' }
        if (index == 4) { this.workingHours.friday.workHours = '[8:00,21:00]' }
        if (index == 5) { this.workingHours.saturday.workHours = '[8:00,21:00]' }
        if (index == 6) { this.workingHours.sunday.workHours = '[8:00,21:00]' }
      }
      else
      {
        if (this.singleDay == 0) { this.workingHours.monday.workHours = '[8:00,21:00]' }
        if (this.singleDay == 1) { this.workingHours.tuesday.workHours = '[8:00,21:00]' }
        if (this.singleDay == 2) { this.workingHours.wednesday.workHours = '[8:00,21:00]' }
        if (this.singleDay == 3) { this.workingHours.thursday.workHours = '[8:00,21:00]' }
        if (this.singleDay == 4) { this.workingHours.friday.workHours = '[8:00,21:00]' }
        if (this.singleDay == 5) { this.workingHours.saturday.workHours = '[8:00,21:00]' }
        if (this.singleDay == 6) { this.workingHours.sunday.workHours = '[8:00,21:00]' }
      }  

      this.generateHoursMatrix();
    }

    //this.generateWorkingHoursIntervals();
    this.selectTimeSlot.emit(this.workingHours);
  }
  getTimeslotValueAsString(timeslot: Timeslot): string
  {
    let h = new Date(timeslot.startTime).getHours().toString().length < 2 ? '0' + new Date(timeslot.startTime).getHours().toString() : new Date(timeslot.startTime).getHours().toString();
    let m = new Date(timeslot.startTime).getMinutes().toString().length < 2 ? '0' + new Date(timeslot.startTime).getMinutes().toString() : new Date(timeslot.startTime).getMinutes().toString();
    let val: string = h + ':' + m;

    return val;
  }

  
}
