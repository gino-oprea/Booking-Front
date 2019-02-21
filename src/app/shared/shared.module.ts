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

@NgModule({
  imports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    GrowlModule,
    ScheduleModule,
    CalendarModule,
    DialogModule,
    DragDropModule
  ],
  declarations: [
    BookingFilterComponent,
    BookingHoursComponent,
    BookingConfirmDialogComponent,
    BookingCalendarComponent,
    FullCalendarComponent
  ],
  exports: [
    BookingFilterComponent,
    BookingHoursComponent,
    BookingConfirmDialogComponent,
    BookingCalendarComponent,
    FullCalendarComponent
  ]
})
export class SharedModule { }