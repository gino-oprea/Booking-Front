import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { ModuleWithProviders } from '@angular/core';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { AuthGuard } from '../route-guards/auth.guard';
import { CompanyGuard } from '../route-guards/company.guard';
import { LevelsComponent } from './levels/levels.component';
import { EntitiesComponent } from './entities/entities.component';
import { LevelLinkingComponent } from './level-linking/level-linking.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { BookingsComponent } from './bookings/bookings.component';
import { FullCalendarComponent } from '../shared/full-calendar/full-calendar.component';
import { TimetablesComponent } from './timetables/timetables.component';
import { BookingsHistoryComponent } from './bookings-history/bookings-history.component';
import { ClientsComponent } from './clients/clients.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyLogsComponent } from './company-logs/company-logs.component';


export const COMPANY_ROUTES: Routes = [
  {
    path: 'company/:id', component: CompanyComponent, canActivate: [AuthGuard, CompanyGuard],
    children: [
      { path: '', redirectTo: 'generaldetails', pathMatch: 'full' },
      { path: 'generaldetails', component: GeneralDetailsComponent },
      { path: 'levels', component: LevelsComponent },
      { path: 'entities', component: EntitiesComponent },
      { path: 'timetables', component: TimetablesComponent },
      { path: 'entities/:idLevel/:idEntity', component: EntitiesComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'bookings-history', component: BookingsHistoryComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'company-users', component: CompanyUsersComponent },
      { path: 'level-linking', component: LevelLinkingComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'company-logs', component: CompanyLogsComponent }
      //{ path: 'subscription', component: SubscriptionComponent },
      //{ path: 'reviews', component: FullCalendarComponent }
    ]
  }
];

export const companyRouting: ModuleWithProviders = RouterModule.forChild(COMPANY_ROUTES);