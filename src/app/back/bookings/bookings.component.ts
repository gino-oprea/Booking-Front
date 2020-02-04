import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions, DurationType, MessageType, BookingStatus } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { BookingDefaultDuration } from '../../objects/booking-default-duration';
import { BookingFilter } from '../../objects/booking-filter';
import { SelectBookingHourTransferObject } from '../../company-booking/select-booking-hour-transfer-object';
import { AutoAssignedEntityCombination } from '../../objects/auto-assigned-entity-combination';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { BookingService } from '../../app-services/booking.service';
import { EntitiesService } from '../../app-services/entities.service';
import { CommonServiceMethods } from '../../app-services/common-service-methods';
import { AutoAssignPayload } from '../../objects/auto-assign-payload';
import { BookingSearchFilter } from '../../objects/booking-search-filter';
import { BookingEntity } from '../../objects/booking-entity';
import { PotentialBooking } from '../../objects/potential-booking';
import { Message } from '../../objects/message';
import { Booking } from '../../objects/booking';
import { ImageService } from '../../app-services/image.service';
import { forkJoin } from 'rxjs';
import { Image } from '../../objects/image';

@Component({
  selector: 'bf-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent extends BaseComponent implements OnInit 
{
  public COMP_IMG = require("../../img/company.jpg");

  bookingDefaultDuration: BookingDefaultDuration;
  showCalendarBooking: boolean;
  selectedFilter: BookingFilter;// = new BookingFilter(null, null, new Date());
  shiftedDate: Date = new Date();
  displayDialogConfirmBooking: boolean = false;
  selectedBookingHourTransferObject: SelectBookingHourTransferObject;// = new SelectBookingHourTransferObject(new WorkingDay('', new Date()), []);
  autoAssignedEntityCombination: AutoAssignedEntityCombination;

  timeslotBookings: Booking[] = [];
  selectedBooking: Booking;
  selectedBookingDate: Date;

  bookingSearchFilter: BookingSearchFilter;
  searchString: string = "";
  searchType: number = 1;

  tabs: any;
  isAddTabEnabled: boolean = true;

  searchTypes: { id: number, value: string }[] = [
    { id: 1, value: 'lblPhone' },
    { id: 2, value: 'lblName' },
    { id: 3, value: 'lblEmail' },
  ];

  constructor(private injector: Injector,
    private bookingService: BookingService,
    private imageService: ImageService,
    private entitiesService: EntitiesService)
  {
    super(injector, [
      'lblBookingsManagement',
      'lblSearchBy',
      'lblPhone',
      'lblName',
      'lblEmail',
      'lblSearchTerms',
      'lblAddBooking',
      'lblEditBooking',
      'lblNoBookingsSavedYet',
      'lblBookingRemoved',
      'lblBookingCanceled',
      'lblBookingEdited'
    ]);
    this.site = WebSites.Back;
    this.pageName = "Bookings";

    this.tabs = {
      add: { active: true },
      edit: { active: false }
    };

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
    super.ngOnInit();
    this.getBookingDefaultDuration();
  }

  filterChanged(value: BookingFilter)
  {
    this.selectedFilter = new BookingFilter(value.filteredLevels, value.allEntitiesPossibleCombinations, value.date);
  }

  onShiftWeek(value: Date)
  {
    this.selectedFilter.date = value;
    this.shiftedDate = value;
  }

  getTimeslotBookings(bookingDate: Date)
  {
    this.bookingService.getBookingsByTimeSlot(this.idCompany, CommonServiceMethods.getDateString(bookingDate, true)).subscribe(gro =>
    {
      if (gro.error != '') 
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true, gro.error);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else 
      {
        this.timeslotBookings = <Booking[]>gro.objList;

        if (this.timeslotBookings.length > 0)
        {
          this.selectedBooking = this.timeslotBookings[0];
          this.setupSelectedBookingImages();
          this.selectTab('edit');
        }
        else
        {
          this.selectedBooking = null;
          this.selectTab('add');
        }
      }
    });
  }

  onSelectBookingHour(value: SelectBookingHourTransferObject)
  {
    this.selectedBookingHourTransferObject = value;//JSON.parse(JSON.stringify(value));   

    let selectedTime = this.selectedBookingHourTransferObject.workingDay.workHours.split(',')[0].substring(1);//eliminam paranteza patrata de la inceput    
    let h = selectedTime.split(':')[0];
    let m = selectedTime.split(':')[1];

    this.selectedBookingDate = new Date(this.selectedBookingHourTransferObject.workingDay.date);
    this.selectedBookingDate.setHours(parseInt(h), parseInt(m), 0, 0);
    this.getTimeslotBookings(this.selectedBookingDate);

    this.getAutoAssignedEntities();
    //this.displayDialogConfirmBooking = true;              
  }
  getAutoAssignedEntities()
  {
    if (this.selectedBookingHourTransferObject.workingDay.workHours != "")
    {
      //console.log(this.selectedBookingHourTransferObject.bookingDayTimeslots);
      let startTime: string = "";
      let selectedTime = this.selectedBookingHourTransferObject.workingDay.workHours.split(',')[0].substring(1);//eliminam paranteza patrata de la inceput    
      let h = selectedTime.split(':')[0];
      let m = selectedTime.split(':')[1];
      startTime = h + ":" + m;

      this.bookingService.autoAssignEntitiesToBooking(this.idCompany,
        CommonServiceMethods.getDateString(new Date(this.selectedBookingHourTransferObject.workingDay.date)),
        startTime,
        new AutoAssignPayload(this.selectedFilter.filteredLevels, this.selectedBookingHourTransferObject.bookingDayTimeslots)).subscribe(gro =>
        {
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true, gro.error);
            //this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            //this.logAction(this.idCompany, false, Actions.Add, '', 'auto assign booking');
            if (gro.objList != null)
            {
              this.autoAssignedEntityCombination = <AutoAssignedEntityCombination>gro.objList[0];
              this.enableAddTab(true);
            }
            else
            {
              //this.showPageMessage("warn", "Warning", 'Selected combination duration does not fit in the remaining timeslots! Please select another timeslot!');
              this.enableAddTab(false);
            }
            this.displayDialogConfirmBooking = true;
          }
        });
    }
  }

  enableAddTab(doEnable: boolean)
  {
    if (doEnable)
    {
      this.isAddTabEnabled = true;
      this.tabs.add.active = true;
      this.tabs.edit.active = false;
    }
    else
    {
      this.isAddTabEnabled = false;
      this.tabs.add.active = false;
    }
  }

  getBookingDefaultDuration()
  {
    this.bookingService.getBookingDefaultDuration(this.idCompany).subscribe(result =>
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
          this.bookingDefaultDuration = <BookingDefaultDuration>gro.objList[0];
          this.calculateDefaultDuration();
        }
      }
    });
  }
  calculateDefaultDuration()
  {
    let duration = this.bookingDefaultDuration.defaultDuration;
    let durType = this.bookingDefaultDuration.durationType;

    if (durType == DurationType.Hours || durType == DurationType.Minutes)
    {
      this.showCalendarBooking = false;
    }
    else
    {
      this.showCalendarBooking = true;
    }
  }

  searchBooking()
  {
    if (this.searchString.trim() != "")
    {
      this.bookingSearchFilter = new BookingSearchFilter(this.searchString, this.searchType);
      this.logAction(this.idCompany, false, Actions.Search, '',
        'Search booking, search filter: ' + this.searchString + ' search type: ' + this.searchTypes.find(s => s.id == this.searchType).value);
    }
  }

  clearSearchBooking()
  {
    this.searchString = "";
    this.bookingSearchFilter = null;
  }

  onCloseManageBookingsDialog()
  {
    this.tabs = {
      add: { active: false },
      edit: { active: false }
    };

    if (this.autoAssignedEntityCombination)
    {
      let startTime: Date;
      let selectedTime = this.selectedBookingHourTransferObject.workingDay.workHours.split(',')[0].substring(1);//eliminam paranteza patrata de la inceput    
      let h = selectedTime.split(':')[0];
      let m = selectedTime.split(':')[1];

      let date = new Date(this.selectedBookingHourTransferObject.workingDay.date);
      startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(h), parseInt(m), 0, 0);

      let bookingEntities: BookingEntity[] = [];
      this.autoAssignedEntityCombination.entityCombination.forEach(e =>
      {
        bookingEntities.push(new BookingEntity(e.id, false, e.idLevel, e.isMultipleBooking));
      });

      let potentialBooking: PotentialBooking = new PotentialBooking(null, this.idCompany, bookingEntities, null,
        CommonServiceMethods.getDateTimeString(date), null,
        CommonServiceMethods.getDateTimeString(startTime), null, null);

      if (this.autoAssignedEntityCombination.idPotentialBooking != null)
      {
        this.bookingService.removePotentialBooking(this.autoAssignedEntityCombination.idPotentialBooking).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            console.log(gro);
            this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
          }
          else
          {
            console.log('potential booking removed from server singleton')
          }
        },
          err => this.logAction(this.idCompany, true, Actions.Search, 'http error removing potential booking from server singleton', ''));
      }
    }
  }

  selectTab(title: string)
  {
    if (title == 'add')
    {
      this.tabs.add.active = true;
      this.tabs.edit.active = false;
    }
    if (title == 'edit')
    {
      this.tabs.add.active = false;
      this.tabs.edit.active = true;
    }
  }
  bookingSaved(msg: Message)
  {
    if (msg.type == MessageType.Error)
      this.showPageMessage('error', 'Error', msg.value);
    if (msg.type == MessageType.Warning)
      this.showPageMessage('warn', 'Warning', msg.value);
    if (msg.type == MessageType.Success)
      this.showPageMessage('success', 'Success', msg.value);

    this.displayDialogConfirmBooking = false;
    this.selectedFilter = JSON.parse(JSON.stringify(this.selectedFilter));//this triggers onChanges in booking-hours component
  }

  selectBooking(booking: Booking) 
  {
    this.selectedBooking = booking;
    this.setupSelectedBookingImages();
  }
  setupSelectedBookingImages()
  {
    //setup images
    let requests = [];
    for (let i = 0; i < this.selectedBooking.entities.length; i++)
    {
      const entity = this.selectedBooking.entities[i];
      requests.push(this.imageService.getEntityImages(entity.idEntity));
    }

    forkJoin(requests).subscribe((imageResults: GenericResponseObject[]) =>
    {
      for (let i = 0; i < imageResults.length; i++) 
      {
        const images = <Image[]>imageResults[i].objList;
        this.selectedBooking.entities[i].images = images;
      }
    });
  }

  deleteBooking(event)
  {
    this.getTimeslotBookings(this.selectedBookingDate);
    this.selectedFilter = JSON.parse(JSON.stringify(this.selectedFilter));//this triggers onChanges in booking-hours component   

    if (event.error == null)
    {
      //this.logAction(this.idCompany, false, Actions.Delete, '', 'Booking removed', true, 'Booking removed');
      this.showPageMessage("success", "success", this.getCurrentLabelValue('lblBookingRemoved'));
    }
    else
      //this.logAction(this.idCompany, true, Actions.Delete, event.error, event.error, true);
      this.showPageMessage("error", "error", 'Error');

  }
  cancelBooking(event)
  {
    this.getTimeslotBookings(this.selectedBookingDate);
    this.selectedFilter = JSON.parse(JSON.stringify(this.selectedFilter));//this triggers onChanges in booking-hours component  

    if (event.error == null)
    {
      //this.logAction(this.idCompany, false, Actions.Cancel, '', 'Booking canceled', true, 'Booking canceled');
      this.showPageMessage("success", "success", this.getCurrentLabelValue('lblBookingCanceled'));
    }
    else
      this.logAction(this.idCompany, true, Actions.Cancel, event.error, event.error, true);

  }
  editBooking(event)
  {
    this.getTimeslotBookings(this.selectedBookingDate);
    this.selectedFilter = JSON.parse(JSON.stringify(this.selectedFilter));//this triggers onChanges in booking-hours component   

    if (event.error == null)
    {
      //this.logAction(this.idCompany, false, Actions.Edit, '', 'Booking edited', true, 'Booking edited');
      this.showPageMessage("success", "success", this.getCurrentLabelValue('lblBookingEdited'));
    }
    else
      this.logAction(this.idCompany, true, Actions.Edit, event.error, event.error, true);
  }
}
