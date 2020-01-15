import { NgModule } from "@angular/core";
import { BookingFilterComponent } from './booking-filter/booking-filter.component';
import { BookingHoursComponent } from './booking-hours/booking-hours.component';
import { BookingConfirmDialogComponent } from './booking-confirm-dialog/booking-confirm-dialog.component';
import { BookingCalendarComponent } from './booking-calendar/booking-calendar.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
import
{
  GrowlModule,
  ScheduleModule,
  CalendarModule,
  DialogModule
} from 'primeng/primeng';
import { FullCalendarComponent } from './full-calendar/full-calendar.component';
import { BookingFilter2Component } from './booking-filter2/booking-filter2.component';
import { GenericConfirmDialogComponent } from './generic-confirm-dialog/generic-confirm-dialog.component';

import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    GrowlModule,
    ScheduleModule,
    CalendarModule,
    DialogModule,
    DragDropModule,

    RecaptchaModule
  ],
  declarations: [
    BookingFilterComponent,
    BookingHoursComponent,
    BookingConfirmDialogComponent,
    BookingCalendarComponent,
    FullCalendarComponent,
    BookingFilter2Component,
    GenericConfirmDialogComponent
  ],
  exports: [
    BookingFilterComponent,
    BookingFilter2Component,
    GenericConfirmDialogComponent,
    BookingHoursComponent,
    BookingConfirmDialogComponent,
    BookingCalendarComponent,
    FullCalendarComponent
  ]
})
export class SharedModule { }