import { Component, OnInit, Injector, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../shared/base-component';
import { WebSites, Actions, BookingStatus, UserRoleEnum } from '../../../enums/enums';
import { Booking } from '../../../objects/booking';
import { BookingService } from '../../../app-services/booking.service';
import { GenericResponseObject } from '../../../objects/generic-response-object';
import { forkJoin, identity } from 'rxjs';
import { ImageService } from '../../../app-services/image.service';
import { Image } from '../../../objects/image';
import { CompanyUsersService } from 'app/app-services/company-users.service';
import { CompanyUser } from '../../../objects/user';
import { BookingFilter } from 'app/objects/booking-filter';
import { LevelAsFilter } from 'app/objects/level-as-filter';
import { Timeslot } from 'app/objects/timeslot';
import { CommonServiceMethods } from '../../../app-services/common-service-methods';

@Component({
  selector: 'bf-booking-management-dialog',
  templateUrl: './booking-management-dialog.component.html',
  styleUrls: ['./booking-management-dialog.component.css']
})
export class BookingManagementDialogComponent extends BaseComponent implements OnInit, OnChanges 
{
  public COMP_IMG = require("../../../img/company.jpg");

  @Input() idCompany: number;
  @Input() bookings: Booking[] = [];

  @Output() bookingRemoved = new EventEmitter<string>();
  @Output() bookingCanceled = new EventEmitter<string>();

  selectedBooking: Booking;
  moveBookingDate: Date = new Date();
  moveBookingTimeslots: Timeslot[];
  entityNotSelected: boolean = true;

  currentUserIsEmployee: boolean = false;
  idEntityLinkedToUser: number = null;

  constructor(private injector: Injector,
    private bookingService: BookingService,
    private imageService: ImageService,
    private companyUsersService: CompanyUsersService)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "Booking management dialog";
  }

  ngOnInit() 
  {
    super.ngOnInit();

    this.filterByUserRole();
  }
  ngOnChanges(changes: SimpleChanges): void 
  {    
    if (this.bookings.length > 0)
    {
      this.selectedBooking = this.bookings[0];
      this.setupSelectedBookingImages();
    }
    else
      this.selectedBooking = null;
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
  deleteBooking()
  {
    this.bookingService.removeBooking(this.selectedBooking.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
        this.bookingRemoved.emit(gro.error);
      }
      else 
      {
        this.logAction(this.idCompany, false, Actions.Delete, "", "", true, "Booking removed");      
        this.bookingRemoved.emit("removed");
      }
    });    
  }
  cancelBooking()
  {
    this.bookingService.cancelBooking(this.selectedBooking.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Cancel, gro.error, gro.errorDetailed, true);
        this.bookingCanceled.emit(gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Cancel, "", "", true, "Booking canceled");
        this.bookingCanceled.emit("canceled");
        // this.getTimeslotBookings(this.selectedBookingDate);
        // this.selectedFilter = JSON.parse(JSON.stringify(this.selectedFilter));//this triggers onChanges in booking-hours component
      }
    });
  }
  setBookingHonored()
  {
    this.bookingService.setBookingStatus(this.selectedBooking, BookingStatus.Honored).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Edit, "", "", true, "Booking honored");
        this.selectedBooking.idStatus = BookingStatus.Honored;
      }
    });
  }
  moveBooking()
  {
    
  }

  getBookingStatusString(idStatus: number)
  {
    return BookingStatus[idStatus];
  }

  isButtonDisabledByRole()
  {
    if (this.selectedBooking)
    {
      if (this.currentUserIsEmployee && this.selectedBooking.entities.find(e => e.idEntity == this.idEntityLinkedToUser) == null)
        return true;
      else
        return false;
    }
    else
      return true;
  }
  filterByUserRole()
  {
    let user = this.loginService.getCurrentUser();
    if (user)
      if (user.roles)
        if (user.roles.find(r => r.idRole == UserRoleEnum.Employee && r.idCompany == this.idCompany))
        {
          this.companyUsersService.getCompanyUsers(this.idCompany).subscribe(gro =>
          {
            if (gro.error != "")
              this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
            else
            {
              let companyUsers = <CompanyUser[]>gro.objList;          

              let companyUserLoggedIn = companyUsers.find(cu => cu.id == user.id)
              if (companyUserLoggedIn)
              {
                this.idEntityLinkedToUser = companyUserLoggedIn.linkedIdEntity;     
                if (this.idEntityLinkedToUser)                
                  this.currentUserIsEmployee = true;
              }
            }
          });
        }
  }
  moveBookingfilterChanged(value)
  {
    if (value.filteredLevels.find(l => l.entities.length > 1) != null)
      this.entityNotSelected = true;
    else
      this.entityNotSelected = false;
      
    let selectedFilter = new BookingFilter(value.filteredLevels, value.allEntitiesPossibleCombinations, value.date);

    let weekDates: string[] = this.getWeekDatesAsStrings(value.date);
    this.loadTimeslots(value.filteredLevels, weekDates, value.date);
  }

  loadTimeslots(filter: LevelAsFilter[], weekDates: string[], selectedFilterDate: Date)
  {
    this.bookingService.generateHoursMatrix(this.idCompany, weekDates, filter, null).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        if (gro.objList.length > 0)
        {
          let hoursMatrix = <Timeslot[][][]>gro.objList;
          let selectedDayTimeslots = this.flattenTimeslotMatrix(hoursMatrix.filter(d =>
          {
            return CommonServiceMethods.getDateString(new Date(d[0][0].startTime)) == CommonServiceMethods.getDateString(selectedFilterDate);              
          }));

          this.moveBookingTimeslots = selectedDayTimeslots.filter(t => t.isSelectable && !t.isFullBooked);
        }
      }
    });
  }
  flattenTimeslotMatrix(matrix: Timeslot[][][]):Timeslot[]
  {
    let timeslots: Timeslot[] = [];

    for (let i = 0; i < matrix.length; i++)
    {
      let l1 = matrix[i];
      for (let j = 0; j < l1.length; j++)
      {
        let l2 = l1[j];
        for (let k = 0; k < l2.length; k++)
        {
          let l3 = l2[k];
          l3.startTime = new Date(l3.startTime);
          l3.endTime = new Date(l3.endTime);
          
          timeslots.push(l3);
        }
      }
    }

    return timeslots;
  }
  getDateStringWrapper(d: Date)
  {
    return CommonServiceMethods.getDateString(d, true);
  }
  getTimeStringWrapper(d: Date)
  {
    return CommonServiceMethods.getTimeString(d);
  }
  getWeekDatesAsStrings(selDate: Date): string[]
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
}
