import {companyRouting} from './company.routing';
import { CompanyGuard } from '../route-guards/company.guard';
import { LevelsComponent } from './levels/levels.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import
{
  CalendarModule,
  CheckboxModule,  
  DialogModule,
  DropdownModule,
  FileUploadModule,
  GMapModule,
  GrowlModule,
  InputSwitchModule,
  OrderListModule,
  ScheduleModule,
  TreeModule,
} from 'primeng/primeng';
import { TableModule } from 'primeng/table'
import { EntitiesComponent } from './entities/entities.component';
import { LevelLinkingComponent } from './level-linking/level-linking.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { CompanyComponent } from './company.component';
import { GeneralDetailsComponent } from "app/back/general-details/general-details.component";
import { WorkingHoursComponent } from "app/back/shared/working-hours/working-hours.component";
import { BookingsComponent } from './bookings/bookings.component';
import { SharedModule } from '../shared/shared.module';
import { TimetablesComponent } from './timetables/timetables.component';


@NgModule({
  imports: [
    CommonModule,
    companyRouting,
    GrowlModule,
    ReactiveFormsModule,
    FormsModule,
    GMapModule,
    FileUploadModule,
    DropdownModule,
    ScheduleModule,
    InputSwitchModule,
    DialogModule,
    CheckboxModule,
    TableModule,
    CalendarModule,
    TreeModule,
    SharedModule
  ],
  declarations: [
    CompanyComponent,
    GeneralDetailsComponent,
    WorkingHoursComponent,
    LevelsComponent,
    EntitiesComponent,
    LevelLinkingComponent,
    SubscriptionComponent,
    BookingsComponent,
    TimetablesComponent    
  ],
  providers: [
    CompanyGuard
  ]
})
export class BackModule { }
