import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { Injector } from '@angular/core';
import { Booking } from '../objects/booking';
import { UsersService } from '../app-services/users.service';
import { BookingService } from '../app-services/booking.service';
import { GenericResponseObject } from '../objects/generic-response-object';

@Component({
  selector: 'bf-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent extends BaseComponent implements OnInit 
{
  bookings: Booking[];
  selectedBooking: Booking;
  displayConfirmDialog: boolean = false;

  constructor(private injector: Injector,
    private bookingService: BookingService)
  {
    super(injector,
      [
        'lblConfirmation',
        'lblYes',
        'lblNo'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "My Bookings";
  }

  ngOnInit()
  {
    this.logAction(null, false, Actions.View, "", "");

    this.getBookings();
  }

  getBookings()
  {
    var currentUser = this.loginService.getCurrentUser();
    this.bookingService.getBookingsByUser(currentUser.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.bookings = <Booking[]>gro.objList;
        if (this.bookings.length > 0)
          this.selectedBooking = this.bookings[0];
        else
          this.selectedBooking = null;
        //console.log(this.bookings);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting bookings', ''));
  }

  selectBooking(booking: Booking)
  {
    this.selectedBooking = booking;
  }

  // deleteBooking()
  // {
  //   this.bookingService.removeBooking(this.selectedBooking.id).subscribe(result => 
  //   {
  //     let gro = <GenericResponseObject>result;
  //     if (gro.error != '')
  //     {
  //       this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed,true);        
  //     }
  //     else
  //     {
  //       this.showPageMessage('success', 'Booking removed', gro.error);
  //       this.getBookings();        
  //     }
  //   },
  //     err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleing booking id:' + this.selectedBooking.id, ''));
  // }
  showConfirmDialog()
  {
    this.displayConfirmDialog = true;
  }
  onCancelBooking()
  {
    this.displayConfirmDialog = false;

    this.bookingService.cancelBooking(this.selectedBooking.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, "", "", true, "Booking canceled");    
        this.getBookings();
      }
    });
  }

}
