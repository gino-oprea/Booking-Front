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

}
