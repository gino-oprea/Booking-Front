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
import { RoleGuard } from 'app/route-guards/role.guard';


export const COMPANY_ROUTES: Routes = [
  {
    path: 'company/:id', component: CompanyComponent, canActivate: [AuthGuard, CompanyGuard],
    children: [
      { path: '', redirectTo: 'generaldetails', pathMatch: 'full' },
      { path: 'generaldetails', component: GeneralDetailsComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' } },
      { path: 'levels', component: LevelsComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  },
      { path: 'entities', component: EntitiesComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' } },
      { path: 'timetables', component: TimetablesComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  },
      { path: 'entities/:idLevel/:idEntity', component: EntitiesComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  },
      { path: 'bookings', component: BookingsComponent, canActivate: [RoleGuard], data: { role: 'Employee' }  },
      { path: 'bookings-history', component: BookingsHistoryComponent, canActivate: [RoleGuard], data: { role: 'Employee' }  },
      { path: 'clients', component: ClientsComponent, canActivate: [RoleGuard], data: { role: 'Employee' } },
      { path: 'company-users', component: CompanyUsersComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  },
      { path: 'level-linking', component: LevelLinkingComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  },
      { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  },
      { path: 'company-logs', component: CompanyLogsComponent, canActivate: [RoleGuard], data: { role: 'CompanyOwner' }  }
      //{ path: 'subscription', component: SubscriptionComponent },
      //{ path: 'reviews', component: FullCalendarComponent }
    ]
  }
];

export const companyRouting: ModuleWithProviders = RouterModule.forChild(COMPANY_ROUTES);