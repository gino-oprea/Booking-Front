import { companyRouting } from './company.routing';
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
  ChartModule
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
import { BookingManagementDialogComponent } from './shared/booking-management-dialog/booking-management-dialog.component';
import { BookingsHistoryComponent } from './bookings-history/bookings-history.component';
import { ClientsComponent } from './clients/clients.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyLogsComponent } from './company-logs/company-logs.component';
import { CompanySecurityComponent } from './company-security/company-security.component';
import { CompanyRolesComponent } from './company-roles/company-roles.component';

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
    ChartModule,
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
    TimetablesComponent,
    BookingManagementDialogComponent,
    BookingsHistoryComponent,
    ClientsComponent,
    CompanyUsersComponent,
    DashboardComponent,
    CompanyLogsComponent,
    CompanySecurityComponent,
    CompanyRolesComponent
  ],
  providers: [
    CompanyGuard
  ]
})
export class BackModule { }
