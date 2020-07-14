import { SearchCompanyComponent } from './search-company/search-company.component';
import { RouterModule, CanActivate } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
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
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { CompanyAllowBookingGuard } from './route-guards/company-allow-booking.guard';
import { GdprComponent } from './terms-conditions/gdpr/gdpr.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions/terms-conditions.component';
import { ContactComponent } from './contact/contact.component';
import { FavouriteCompaniesComponent } from './favourite-companies/favourite-companies.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const APP_ROUTES = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    //{ path: '', component: SearchCompanyComponent },    

    
    { path: 'gdpr', component: GdprComponent },
    { path: 'termsconditions', component: TermsConditionsComponent },
    { path: 'contact', component: ContactComponent },

    { path: 'login', component: UserLoginComponent, canActivate: [NonAuthGuard] },
    { path: 'register', component: UserRegistrationComponent, canActivate: [NonAuthGuard] },
    { path: 'useractivation/:activationKey', component: UserActivationComponent },
    { path: 'searchcompany', component: SearchCompanyComponent },
    { path: 'companybooking/:id/:companyname', component: CompanyBookingComponent, canActivate: [CompanyAllowBookingGuard] },
    { path: 'companydetails/:id/:companyname', component: CompanyDetailsComponent, canActivate: [CompanyBookingGuard] },
    { path: 'myaccount', component: MyAccountComponent, canActivate: [AuthGuard] },
    { path: 'mybookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
    { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'mycompanies', component: MyCompaniesComponent, canActivate: [AuthGuard] },
    { path: 'favourites', component: FavouriteCompaniesComponent, canActivate: [AuthGuard] },
    { path: 'company/:id', loadChildren: () => import('app/back/back.module').then(m => m.BackModule) },

    { path: 'landing', component: LandingPageComponent },

    { path: '**', redirectTo: '/landing' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);