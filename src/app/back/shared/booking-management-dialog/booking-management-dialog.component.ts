import { Component, OnInit, Injector, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../shared/base-component';
import { WebSites, Actions } from '../../../enums/enums';
import { Booking } from '../../../objects/booking';
import { BookingService } from '../../../app-services/booking.service';
import { GenericResponseObject } from '../../../objects/generic-response-object';
import { forkJoin } from 'rxjs';
import { ImageService } from '../../../app-services/image.service';
import { Image } from '../../../objects/image';

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

  selectedBooking: Booking;

  constructor(private injector: Injector,
    private bookingService: BookingService,
    private imageService: ImageService)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "Booking management dialog";
  }

  ngOnInit() 
  {
    
  }
  ngOnChanges(changes: SimpleChanges): void 
  {
    super.ngOnInit();
    if (this.bookings.length > 0)
    {
      this.selectedBooking = this.bookings[0];
      this.setupSelectedBookingImages();
    }
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
        //this.logAction(this.idCompany, false, Actions.Delete, "", "", true, "Booking removed");      
        this.bookingRemoved.emit("removed");
      }
    });    
  }

}
