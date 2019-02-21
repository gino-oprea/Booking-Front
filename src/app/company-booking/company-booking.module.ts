import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import
{
  GrowlModule,
  ScheduleModule,
  CalendarModule,
  DialogModule
} from 'primeng/primeng';
import { CompanyBookingComponent } from './company-booking.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [    
    CommonModule,
    FormsModule,    
    GrowlModule,
    ScheduleModule,
    CalendarModule,
    DialogModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CompanyBookingComponent,
    
  ]
})
export class CompanyBookingModule { }
