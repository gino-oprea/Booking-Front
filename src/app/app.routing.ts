import { SearchCompanyComponent } from './search-company/search-company.component';
import { RouterModule, CanActivate } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserActivationComponent } from './user-activation/user-activation.component';
import { NonAuthGuard } from './route-guards/non-auth.guard';
import { MyAccountComponent } from './my-account/my-account.component';
import { AuthGuard } from './route-guards/auth.guard';
import { ChangePasswordComponent } from './my-account/change-password.component';
import { MyCompaniesComponent } from './my-companies/my-companies.component';
import { CompanyBookingComponent } from './company-booking/company-booking.component';
import { CompanyBookingGuard } from './route-guards/company-booking.guard';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

const APP_ROUTES = [
    { path: '', redirectTo: 'searchcompany', pathMatch: 'full' },
    //{ path: '', component: SearchCompanyComponent },    
    
    { path: 'register', component: UserRegistrationComponent, canActivate: [NonAuthGuard] },
    { path: 'useractivation/:activationKey', component: UserActivationComponent },
    { path: 'searchcompany', component: SearchCompanyComponent },
    { path: 'companybooking/:id/:companyname', component: CompanyBookingComponent, canActivate: [CompanyBookingGuard] },
    { path: 'myaccount', component: MyAccountComponent, canActivate: [AuthGuard] },
    { path: 'mybookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
    { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'mycompanies', component: MyCompaniesComponent, canActivate: [AuthGuard] },
    { path: 'company/:id', loadChildren: 'app/back/back.module#BackModule' },
    
    { path: '**', redirectTo: '/searchcompany' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);