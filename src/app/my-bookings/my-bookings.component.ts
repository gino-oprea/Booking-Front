import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { Injector } from '@angular/core';
import { Booking } from '../objects/booking';
import { UsersService } from '../app-services/users.service';
import { BookingService } from '../app-services/booking.service';
import { GenericResponseObject } from '../objects/generic-response-object';
import { forkJoin } from 'rxjs';
import { Image } from '../objects/image';
import { ImageService } from '../app-services/image.service';

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

  public COMP_IMG = require("../img/company.jpg");

  constructor(private injector: Injector,
    private bookingService: BookingService,
    private imageService: ImageService)
  {
    super(injector,
      [
        'lblConfirmation',
        'lblYes',
        'lblNo',
        'lblMyBookings',
        'lblDate',
        'lblCompanyName',
        'lblStartTime',
        'lblEndTime',
        'lblAddress',
        'lblPhone',
        'lblCancel',
        'lblBooking',
        'lblConfirmCancelBooking'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "My Bookings";
  }

  ngOnInit()
  {
    super.ngOnInit();

    this.getBookings();
  }

  getBookings()
  {
    var currentUser = this.loginService.getCurrentUser();
    this.bookingService.getBookingsByUser(currentUser.id, new Date()).subscribe(result =>
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
        {
          this.selectedBooking = this.bookings[0];
          this.setupSelectedBookingImages();
        }
        else
          this.selectedBooking = null;
        //console.log(this.bookings);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting bookings', ''));
  }

  selectBooking(event)//booking: Booking)
  {
    this.selectedBooking = event.data;// booking;
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
        this.logAction(this.idCompany, true, Actions.Cancel, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Cancel, "", "Booking canceled", true, "Booking canceled");
        this.getBookings();
      }
    });
  }

}
