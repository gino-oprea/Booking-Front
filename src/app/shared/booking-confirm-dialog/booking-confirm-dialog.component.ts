//import { EntityWithLevel } from '../../objects/entity-with-level';
import { Component, Injector, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';
import { WebSites, Actions, MessageType } from '../../enums/enums';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { WorkingDay } from '../../objects/working-day';
import { Observable, Subscription } from 'rxjs';
import { BookingService } from '../../app-services/booking.service';
import { Booking } from '../../objects/booking';
import { BookingEntity } from 'app/objects/booking-entity';
import { AutoAssignedEntityCombination } from 'app/objects/auto-assigned-entity-combination';
import { Message } from '../../objects/message';
import { debounceTime } from 'rxjs/operators';
import { User } from '../../objects/user';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { ImageService } from '../../app-services/image.service';
import { RecaptchaService } from '../../app-services/recaptcha.service';


@Component({
  selector: 'bf-booking-confirm-dialog',
  templateUrl: './booking-confirm-dialog.component.html',
  styleUrls: ['./booking-confirm-dialog.component.css']
})
export class BookingConfirmDialogComponent extends BaseComponent implements OnInit, OnChanges 
{
  @Output() bookingSaved = new EventEmitter<Message>();

  @Input() idCompany: number;
  @Input() isBookingByDay: boolean;
  @Input() selectedDayTime: WorkingDay;

  @Input() isAdminAddBooking: boolean;
  @Input() existingBooking: Booking;

  @Input() autoAssignedEntityCombination: AutoAssignedEntityCombination;

  @Input() resetCaptcha: boolean = false;

  validCaptcha: boolean = true;

  public COMP_IMG = require("../../img/puzzle_piece.jpg");

  phoneChangeSubscription: Subscription;
  emailChangeSubscription: Subscription;

  confirmBooking: FormGroup;
  en: any;

  constructor(private injector: Injector,
    private bookingService: BookingService,
    private imageService: ImageService,
    private recaptchaService: RecaptchaService)
  {
    super(injector, [
      'lblConfirmation',
      'lblFirstName',
      'lblLastName',
      'lblPhone',
      'lblPrice',
      'lblDate',
      'lblStartDate',
      'lblEndDate',
      'lblStartTime',
      'lblEndTime',
      'lblBooking',
      'lblSaved'
    ]);
    this.site = WebSites.Front;
    this.pageName = "Booking confirm dialog";

    this.en = {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    };
  }

  ngOnInit() 
  {

  }
  ngOnChanges(changes: SimpleChanges): void 
  {
    if (changes['resetCaptcha'])
      this.validCaptcha = false;

    if (this.autoAssignedEntityCombination != null)
      this.initConfirmBookingForm();
  }



  initConfirmBookingForm()
  {
    let serviceDuration = 0;
    //if (this.selectedEntitiesWithLevel != null)
    serviceDuration = this.autoAssignedEntityCombination.duration;//this.getDefaultDuration();

    let serviceWithPrice = this.autoAssignedEntityCombination.entityCombination.find(e => e.defaultServicePrice != null);

    let selectedTime = this.selectedDayTime.workHours.split(',')[0].substring(1);//eliminam paranteza patrata de la inceput    
    let h = parseInt(selectedTime.split(':')[0]);
    let m = parseInt(selectedTime.split(':')[1]);

    let endDate = new Date(this.selectedDayTime.date);
    endDate.setDate(endDate.getDate() + 1);

    let date = new Date(this.selectedDayTime.date);
    date.setHours(h, m, 0);

    this.confirmBooking = new FormGroup({
      'firstName': new FormControl(this.currentUser != null && !this.isAdminAddBooking ? this.currentUser.firstName : '', Validators.required),
      'lastName': new FormControl(this.currentUser != null && !this.isAdminAddBooking ? this.currentUser.lastName : '', Validators.required),
      'phone': new FormControl(this.currentUser != null && !this.isAdminAddBooking ? this.currentUser.phone : '', Validators.required),
      'email': new FormControl(this.currentUser != null && !this.isAdminAddBooking ? this.currentUser.email : '',
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")),
      'price': new FormControl(serviceWithPrice != null ? serviceWithPrice.defaultServicePrice + ' RON' : ''),
      'startDate': new FormControl(date),
      'endDate': new FormControl(endDate),
      'date': new FormControl({ value: date, disabled: true }),
      'startTime': new FormControl({ value: date, disabled: true }),
      'endTime': new FormControl({ value: new Date(date.getTime() + serviceDuration), disabled: true })
    });

    if (this.isAdminAddBooking)
    {
      this.setupAutocomplete();
    }
  }

  setupAutocomplete()
  {
    this.phoneChangeSubscription = this.confirmBooking.controls['phone'].valueChanges.pipe(debounceTime(400)).subscribe(result =>
    {
      this.usersService.getUsersForBookingAutocomplete(this.idCompany, null, result.toString()).subscribe(u =>
      {
        let gro = <GenericResponseObject>u;
        if (gro.objList.length > 0)
          this.populateFormWithUserData(gro.objList[0]);
      });
    });

    this.emailChangeSubscription = this.confirmBooking.controls['email'].valueChanges.pipe(debounceTime(400)).subscribe(result =>
    {
      this.usersService.getUsersForBookingAutocomplete(this.idCompany, result.toString(), null).subscribe(u =>
      {
        let gro = <GenericResponseObject>u;
        if (gro.objList.length > 0)
          this.populateFormWithUserData(gro.objList[0]);
      });
    });
  }
  populateFormWithUserData(user: User)
  {
    this.phoneChangeSubscription.unsubscribe();
    this.emailChangeSubscription.unsubscribe();

    this.confirmBooking.controls['firstName'].setValue(user.firstName);
    this.confirmBooking.controls['lastName'].setValue(user.lastName);
    this.confirmBooking.controls['phone'].setValue(user.phone);
    this.confirmBooking.controls['email'].setValue(user.email);

    this.setupAutocomplete();
  }

  saveBooking()
  {
    //console.log(this.confirmBooking.value);
    let bookingEntities: BookingEntity[] = [];
    for (let i = 0; i < this.autoAssignedEntityCombination.entityCombination.length; i++) 
    {
      if (this.autoAssignedEntityCombination.entityCombination[i].id != null)
      {
        //bookingEntities.push(new BookingEntity(this.autoAssignedEntityCombination.entityCombination[i].id, false));
        bookingEntities.push(
          {
            idEntity: this.autoAssignedEntityCombination.entityCombination[i].id,
            isAutoAssigned: false,
            entityName_EN: this.autoAssignedEntityCombination.entityCombination[i].entityName_EN,
            entityName_RO: this.autoAssignedEntityCombination.entityCombination[i].entityName_RO
          }
        );
      }
    }

    let booking = new Booking();
    booking.idCompany = this.idCompany;
    booking.entities = bookingEntities;
    //aici daca salvarea se face din admin trebuie gasit automat user-ul cu email-ul completat de operator, daca exista
    booking.idUser = this.currentUser != null && !this.isAdminAddBooking ? this.currentUser.id : null;
    booking.firstName = this.confirmBooking.controls['firstName'].value;
    booking.lastName = this.confirmBooking.controls['lastName'].value;
    booking.phone = this.confirmBooking.controls['phone'].value;
    booking.email = this.confirmBooking.controls['email'].value;
    booking.startDate = this.confirmBooking.controls['date'].value;
    booking.startTime = this.confirmBooking.controls['startTime'].value;
    booking.endTime = this.confirmBooking.controls['endTime'].value;

    var message: Message = null;
    this.bookingService.addBooking(booking).subscribe(gro =>
    {

      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
        message = new Message(MessageType.Error, gro.error);
      }
      else
      {
        let bookingLogInfo = booking.firstName + " " + booking.lastName + " "
          + new Date(booking.startDate).toDateString() + " "
          + new Date(booking.startTime).toTimeString();

        this.logAction(this.idCompany, false, Actions.Add, '', 'add booking: ' + bookingLogInfo);
        //this.showPageMessage('success', 'Success', 'booking saved');
        message = new Message(MessageType.Success, this.getCurrentLabelValue('lblSaved'));
      }

      this.bookingSaved.emit(message);
    },
      err =>
      {
        this.logAction(this.idCompany, true, Actions.Add, 'http error adding booking', err.status + ' ' + err.statusText);
        //this.showPageMessage('error', 'Error', err.status + ' ' + err.statusText);
        message = new Message(MessageType.Error, err.status + ' ' + err.statusText);

        this.bookingSaved.emit(message);
      });
  }

  onResolvedCaptcha(captchaResponse: string)
  {
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaService.checkCaptchaResponse(captchaResponse).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
      else
        this.validCaptcha = JSON.parse(gro.objList[0]).success;
    });
  }
}
