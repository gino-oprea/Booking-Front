import { Component, OnInit, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { BookingService } from '../../app-services/booking.service';
import { WebSites, Actions, BookingStatus } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'app/objects/booking';
import { CommonServiceMethods } from 'app/app-services/common-service-methods';
import { NonAuthGuard } from '../../route-guards/non-auth.guard';

@Component({
  selector: 'bf-bookings-history',
  templateUrl: './bookings-history.component.html',
  styleUrls: ['./bookings-history.component.css']
})
export class BookingsHistoryComponent extends BaseComponent implements OnInit, OnChanges
{

  @Input() isDialog: boolean = false;
  @Input() phone: string = null;

  en: any;
  confirmDeleteBookingMessage: string = "Are you sure you want to delete this booking?";
  displayConfirmDeleteBooking: boolean = false;
  bookings: Booking[] = [];
  idBooking: number;

  currentDate = new Date();
  startDate: Date = new Date(new Date().setDate(this.currentDate.getDate() - 7));
  endDate: Date = new Date(new Date().setDate(this.currentDate.getDate() + 7));

  constructor(private injector: Injector,
    private bookingService: BookingService)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "Bookings History";

    this.en = {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
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
    this.loadBookings();
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    this.loadBookings();
  }
  loadBookings()
  {
    let startDateString = CommonServiceMethods.getDateString(this.startDate);
    let endDateString = CommonServiceMethods.getDateString(this.endDate);

    this.bookingService.getBookings(this.idCompany, startDateString, endDateString, true).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        if (this.phone == null)
          this.bookings = <Booking[]>gro.objList;
        else
          this.bookings = <Booking[]>gro.objList.filter(b => b.phone == this.phone);
      }
    });
  }
  getBookingEntitiesCombinationString(booking: Booking)
  {
    let combString = '';
    for (let i = 0; i < booking.entities.length; i++)
    {
      const entity = booking.entities[i];
      if (combString == '')
        combString += entity.entityName_RO
      else
        combString += ' - ' + entity.entityName_RO;
    }
    return combString;
  }
  getBookingStatusString(idStatus: number)
  {
    return BookingStatus[idStatus];
  }
  getBookingTimeString(booking: Booking)
  {
    let startTimeString = CommonServiceMethods.getTimeString(new Date(booking.startTime));
    let endTimeString = CommonServiceMethods.getTimeString(new Date(booking.endTime));

    return startTimeString + ' - ' + endTimeString;
  }
  deleteBooking()
  {
    this.bookingService.removeBooking(this.idBooking).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'delete booking', true, 'Booking deleted');
        this.loadBookings();
      }
    });
  }
  onConfirmDelete(message: string)
  {
    if (message == "yes")
      this.deleteBooking();

    this.displayConfirmDeleteBooking = false;
  }
  toggleBookingStatus(booking: Booking)
  {
    switch (booking.idStatus) 
    {
      case 1:
        //set honored  
        this.bookingService.setBookingStatus(booking, 2).subscribe(gro =>
        {
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Edit, "", "", true, "Booking honored");
            this.loadBookings();
          }
        });
        break;
      case 2:
        //set canceled
        this.bookingService.cancelBooking(booking.id).subscribe(gro =>
        {
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Cancel, gro.error, gro.errorDetailed, true);
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Cancel, "", "", true, "Booking canceled");
            this.loadBookings();
          }
        });
        break;
      case 3:
        //set active
        this.bookingService.setBookingStatus(booking, 1).subscribe(gro =>
        {
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Edit, "", "", true, "Booking active");
            this.loadBookings();
          }
        });
        break;
    }

  }

}
