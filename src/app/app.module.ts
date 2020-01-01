import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LevelLinkingService } from './app-services/level-linking.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LevelsService } from './app-services/levels.service';
import { SubscriptionsService } from './app-services/subscriptions.service';
import { NonAuthGuard } from './route-guards/non-auth.guard';
import
{
  DropdownModule,
  GrowlModule,
  ConfirmDialogModule,
  ConfirmationService,
  SharedModule,
  GMapModule,
  ButtonModule,
  DialogModule,
  CalendarModule,
  ChartModule
} from 'primeng/primeng';
import { UsersService } from './app-services/users.service';
import { UserRegistrationModule } from './user-registration/user-registration.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { UserActivationModule } from './user-activation/user-activation.module';
import { GeneralSettingsService } from './app-services/general-settings.service';
import { LabelsService } from './app-services/labels.service';
import { LoggerService } from './app-services/logger.service';
import { SearchCompanyModule } from './search-company/search-company.module';
import { HeaderComponent } from './header.component';
import { AuthGuard } from './route-guards/auth.guard';
import { MyAccountModule } from './my-account/my-account.module';
import { MyCompaniesModule } from './my-companies/my-companies.module';
import { BackModule } from './back/back.module';
import { CompanyService } from './app-services/company.service';
import { CountriesService } from './app-services/countries.service';
import { EntitiesService } from './app-services/entities.service';
import { CompanyActiveSubscriptionService } from './app-services/company-active-subscription.service';
import { CompanySearchService } from './app-services/company-search.service';
import { CompanyBookingModule } from './company-booking/company-booking.module';
import { CompanyBookingGuard } from './route-guards/company-booking.guard';
import { BookingService } from './app-services/booking.service';
import { HoursMatrixService } from './app-services/hours-matrix.service';
import { ImageService } from './app-services/image.service';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { LoginService } from './app-services/login.service';
import { ClientService } from './app-services/client.service';
import { CompanyUsersService } from './app-services/company-users.service';
import { RoleGuard } from './route-guards/role.guard';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MyBookingsComponent,
    CompanyDetailsComponent
  ],
  imports: [
    routing,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,

    HttpClientModule,
    ReactiveFormsModule,
    DropdownModule,
    GrowlModule,
    GMapModule,
    ConfirmDialogModule,
    SharedModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    ChartModule,

    UserRegistrationModule,
    UserActivationModule,
    SearchCompanyModule,
    MyAccountModule,
    MyCompaniesModule,
    BackModule,
    CompanyBookingModule
  ],
  providers: [
    ConfirmationService,
    HoursMatrixService,
    UsersService,
    CompanyUsersService,
    LoginService,
    GeneralSettingsService,
    LabelsService,
    LoggerService,
    SubscriptionsService,
    CompanyService,
    ImageService,
    CountriesService,
    LevelsService,
    EntitiesService,
    LevelLinkingService,
    CompanyActiveSubscriptionService,
    CompanySearchService,
    BookingService,
    ClientService,
    AuthGuard,
    NonAuthGuard,
    CompanyBookingGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
