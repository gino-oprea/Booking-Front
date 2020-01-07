import { Component, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, ElementRef, ViewChild } from '@angular/core';
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
  styleUrls: ['./working-hours.component.css','./multi-select.css']  
})
export class WorkingHoursComponent extends BaseComponent implements OnInit, OnChanges
{
  @Input() singleDay: number = -1;//indexul zilei care vrem sa se genereze, daca e -1 se genereaza toata saptamana
  @Input() workingHours: WorkingHours = null;
  @Input() workingHoursBounds: WorkingHours = null;
  @Input() disabled: boolean = false;
  @Output() selectTimeSlot = new EventEmitter<WorkingHours>();

  @ViewChild('parentDiv', { static: false }) parentDiv: ElementRef;

  differ: any;
  hoursMatrix: any[] = [];
  dayNames: any[];
  dayDates: Date[];
  dayOff: any[];

  isSelecting: boolean = false;  
  selectorLeft: number = 0;
  selectorTop: number = 0;  
  initLeft: number = 0;
  initTop: number = 0;
  selectorW: number = 0;
  selectorH: number = 0;
  

  commonMethods: CommonServiceMethods = new CommonServiceMethods(); 
  
  constructor(private injector: Injector, private hoursMatrixService: HoursMatrixService)
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
        //this.showPageMessage('error', 'Error', gro.error);
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
  // activateTimeSlot(dayIndex: number, hourRowIndex: number, timeslotIndex: number)
  // {
  //   if (!this.disabled && this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelectable)
  //   {
  //     //alert(this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].val.toString());
  //     if (!this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected)
  //       this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected = true;
  //     else
  //       this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected = false;

  //     this.generateWorkingHoursIntervals();
  //     //console.log(this.workingHours);

  //     this.autoToggleDayOff();

  //     this.selectTimeSlot.emit(this.workingHours);
  //   }  
  // }

  activateMultipleTimeslots(timeslotsIds:string[])
  {
    let selectableExists = false;

    for (let i = 0; i < timeslotsIds.length; i++) 
    {
      let timeslotId = timeslotsIds[i];
      let timeslotsIdElements = timeslotId.split('_');

      let dayIndex = timeslotsIdElements[0];
      let hourRowIndex = timeslotsIdElements[1];
      let timeslotIndex = timeslotsIdElements[2];

      if (!this.disabled && this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelectable)
      {
        selectableExists = true;

        if (!this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected)
          this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected = true;
        else
          this.hoursMatrix[dayIndex][hourRowIndex][timeslotIndex].isSelected = false;
      }       
    }

    if (selectableExists)
    {
      this.generateWorkingHoursIntervals();
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

  ///////////////

  onMouseDown(e: MouseEvent)
  {
    this.isSelecting = true;  

    //this.parentDiv.nativeElement.offsetLeft
    //var x = (e.pageX - this.parentDiv.nativeElement.offsetLeft) + this.window.pageXOffset;  
    
    //var bodyRect = document.body.getBoundingClientRect();
    var parentDivRect = document.getElementById('parentDiv').getBoundingClientRect();
    var offsetTop = parentDivRect.top;// - bodyRect.top;
    var offsetLeft = parentDivRect.left;// - bodyRect.left;

    let pageX = e.pageX - offsetLeft + 15;// - 35;
    let pageY = e.pageY - offsetTop; //- 138;

    this.selectorLeft = pageX;
    this.selectorTop = pageY;   

    this.initLeft = pageX;
    this.initTop = pageY;
  }
  onMouseUp(e: MouseEvent)
  {
    this.isSelecting = false;

    this.selectorLeft = 0;
    this.selectorTop = 0;
    this.selectorH = 0;
    this.selectorW = 0;

    let selectedTimeslots = this.detectSelectedTimeslots();
    this.activateMultipleTimeslots(selectedTimeslots)
  }
  detectSelectedTimeslots(): string[]
  {
    var timeslotSelectedIds:string[] = [];
    for (let i = 0; i < this.hoursMatrix.length; i++) 
    {
      let days = this.hoursMatrix[i];
      for (let j = 0; j < days.length; j++) 
      {
        let hours = days[j];
        for (let k = 0; k < hours.length; k++) 
        {
          let timeslot = hours[k];
          let timeslotId = i + '_' + j + '_' + k;

          let selectionTop = document.getElementById('selectionDiv').getBoundingClientRect().top;
          let selectionLeft = document.getElementById('selectionDiv').getBoundingClientRect().left;
          let selectionHeight = document.getElementById('selectionDiv').getBoundingClientRect().height;//parseInt(document.getElementById('selectionDiv').style.height.replace('px',''));
          let selectionWidth = document.getElementById('selectionDiv').getBoundingClientRect().width;//parseInt(document.getElementById('selectionDiv').style.width.replace('px', ''));

          let timeslotTop = document.getElementById(timeslotId).getBoundingClientRect().top;
          let timeslotLeft = document.getElementById(timeslotId).getBoundingClientRect().left;
          let timeslotHeight = document.getElementById(timeslotId).getBoundingClientRect().height;//parseInt(document.getElementById(timeslotId).style.height.replace('px', ''));
          let timeslotWidth = document.getElementById(timeslotId).getBoundingClientRect().width;//parseInt(document.getElementById(timeslotId).style.width.replace('px', ''));

          if (selectionLeft < timeslotLeft + timeslotWidth &&
            selectionLeft + selectionWidth > timeslotLeft &&
            selectionTop < timeslotTop + timeslotHeight &&
            selectionTop + selectionHeight > timeslotTop)
            timeslotSelectedIds.push(timeslotId);
        }
      }      
    }

    return timeslotSelectedIds;
  }
  onMousemove(e:MouseEvent)
  {
    if (this.isSelecting)
    { 
      //var bodyRect = document.body.getBoundingClientRect();
      var parentDivRect = document.getElementById('parentDiv').getBoundingClientRect();
      var offsetTop = parentDivRect.top;// - bodyRect.top;
      var offsetLeft = parentDivRect.left;// - bodyRect.left;

      //asta nu merge bine pe pagina de company general details...nu e corecta formula pentru offset
      let pageX = e.pageX - offsetLeft + 15;// - 35;
      let pageY = e.pageY - offsetTop; //- 138;
      
      this.selectorW = Math.abs(this.initLeft - pageX);
      this.selectorH = Math.abs(this.initTop - pageY);

      if (pageX <= this.initLeft && pageY >= this.initTop)
      {
        this.selectorLeft = pageX;
      }
      else
        if (pageY <= this.initTop && pageX >= this.initLeft)
          this.selectorTop = pageY;
        else
          if (pageY < this.initTop && pageX < this.initLeft)
          {
            this.selectorLeft = pageX;
            this.selectorTop = pageY;
          }            
    }
  }
}
