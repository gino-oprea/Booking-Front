import { UsersService } from './users.service';

import { Injectable } from '@angular/core';
import { GenericResponseObject } from '../objects/generic-response-object';
import { CommonServiceMethods } from './common-service-methods';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Booking } from '../objects/booking';
import { LevelAsFilter } from '../objects/level-as-filter';
import { Timeslot } from '../objects/timeslot';
import { AutoAssignPayload } from '../objects/auto-assign-payload';
import { PotentialBooking } from '../objects/potential-booking';
import { BookingSearchFilter } from '../objects/booking-search-filter';
import { AppConfigService } from './app-config.service';

@Injectable()
export class BookingService
{
  currentCulture: string;

  constructor(private httpClient: HttpClient, private usersService: UsersService, private config: AppConfigService)
  {
    this.currentCulture = !!localStorage.getItem('b_front_culture') ? localStorage.getItem('b_front_culture') : 'RO';
  }

  getBookings(idCompany: number, dateStart: string, dateEnd: string, includeCanceled: boolean = false, filterByLinkedEntityToUser: boolean = false): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('dateStart', dateStart);
    params = params.append('dateEnd', dateEnd);
    params = params.append('includeCanceled', includeCanceled.toString());
    params = params.append('filterByLinkedEntityToUser', filterByLinkedEntityToUser.toString());


    let options = {
      headers: null,
      params: params
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'booking/GetBookings/' + idCompany.toString(), options);
  }

  getLevelsAsFilters(idCompany: number, weekDates: string[]): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    for (var i = 0; i < weekDates.length; i++)
    {
      params = params.append('weekDates', weekDates[i]);
    }

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'Booking/GetBookingFilters/' + idCompany.toString(), options);
  }
  setUpBookingFilterEntitiesWorkingHours(idCompany: number, weekDates: string[], levels: LevelAsFilter[]): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    for (var i = 0; i < weekDates.length; i++)
    {
      params = params.append('weekDates', weekDates[i]);
    }


    const body = JSON.stringify(levels);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers),
      params: params
    };

    return this.httpClient.post<GenericResponseObject>(this.config.api_endpoint + 'booking/SetUpBookingFilterEntitiesWorkingHours/'
      + idCompany.toString(), body, options);
  }
  getBookingDefaultDuration(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'Booking/GetBookingDefaultDuration/' + idCompany.toString(), options);
  }
  getBookingRestrictions(idCompany: number, idEntities: number[], weekDates: string[]): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    for (var i = 0; i < idEntities.length; i++)
    {
      params = params.append('idEntities', idEntities[i].toString());
    }
    for (var i = 0; i < weekDates.length; i++)
    {
      params = params.append('weekDates', weekDates[i]);
    }

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'booking/GetBookingRestrictions/' + idCompany.toString(), options);
  }
  editBooking(booking: Booking[]): Observable<GenericResponseObject>
  {
    for (let i = 0; i < booking.length; i++) 
    {
      let sDate = CommonServiceMethods.addUserDateOffset(new Date(booking[i].startDate));
      let eDate = booking[i].endDate != null ? CommonServiceMethods.addUserDateOffset(new Date(booking[i].endDate)) : null;
      let sTime = booking[i].startTime != null ? CommonServiceMethods.addUserDateOffset(new Date(booking[i].startTime)) : null;
      let eTime = booking[i].endTime != null ? CommonServiceMethods.addUserDateOffset(new Date(booking[i].endTime)) : null;

      booking[i].startDate = sDate;
      booking[i].endDate = eDate;
      booking[i].startTime = sTime;
      booking[i].endTime = eTime;
    }


    const body = JSON.stringify(booking);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let params = new HttpParams();
    params = params.append('culture', this.currentCulture);

    let options = {
      headers: headers,
      params: params
    };

    return this.httpClient.put<GenericResponseObject>(this.config.api_endpoint + 'booking', body, options);
  }
  addBooking(booking: Booking): Observable<GenericResponseObject>
  {
    let sDate = CommonServiceMethods.addUserDateOffset(booking.startDate);
    let eDate = booking.endDate != null ? CommonServiceMethods.addUserDateOffset(booking.endDate) : null;
    let sTime = booking.startTime != null ? CommonServiceMethods.addUserDateOffset(booking.startTime) : null;
    let eTime = booking.endTime != null ? CommonServiceMethods.addUserDateOffset(booking.endTime) : null;

    booking.startDate = sDate;
    booking.endDate = eDate;
    booking.startTime = sTime;
    booking.endTime = eTime;

    const body = JSON.stringify(booking);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let params = new HttpParams();
    params = params.append('culture', this.currentCulture);

    let options = {
      headers: headers,
      params: params
    };



    return this.httpClient.post<GenericResponseObject>(this.config.api_endpoint + 'booking', body, options);
  }
  setBookingStatus(booking: Booking, idStatus: number): Observable<GenericResponseObject>
  {
    //first clone the booking object 
    let bookingClone = JSON.parse(JSON.stringify(booking));

    let sDate = CommonServiceMethods.addUserDateOffset(new Date(bookingClone.startDate));
    let eDate = bookingClone.endDate != null ? CommonServiceMethods.addUserDateOffset(new Date(bookingClone.endDate)) : null;
    let sTime = bookingClone.startTime != null ? CommonServiceMethods.addUserDateOffset(new Date(bookingClone.startTime)) : null;
    let eTime = bookingClone.endTime != null ? CommonServiceMethods.addUserDateOffset(new Date(bookingClone.endTime)) : null;

    bookingClone.startDate = sDate;
    bookingClone.endDate = eDate;
    bookingClone.startTime = sTime;
    bookingClone.endTime = eTime;

    const body = JSON.stringify(bookingClone);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers
    };

    return this.httpClient.put<GenericResponseObject>(this.config.api_endpoint + 'booking/SetBookingStatus/' + idStatus.toString(), body, options);
  }
  removePotentialBooking(idPotentialBooking: number)
  {
    //const body = JSON.stringify(potentialBooking);
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.httpClient.delete<GenericResponseObject>(this.config.api_endpoint + 'booking/RemovePotentialBooking/' + idPotentialBooking.toString(), options);
  }
  autoAssignEntitiesToBooking(idCompany: number, bookingDate: string, startTime: string,
    autoAssignPayload: AutoAssignPayload): Observable<GenericResponseObject>
  {
    let params = new HttpParams();

    params = params.append('bookingDate', bookingDate);
    params = params.append('startTime', startTime);

    const body = JSON.stringify(autoAssignPayload);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers),
      params: params
    };

    return this.httpClient.post<GenericResponseObject>(this.config.api_endpoint + 'booking/AutoAssignEntitiesToBooking/'
      + idCompany.toString(), body, options);
  }
  generateHoursMatrix(idCompany: number, weekDates: string[], selectedLevels: LevelAsFilter[], searchFilter?: BookingSearchFilter): Observable<GenericResponseObject>
  {
    let params = new HttpParams();

    for (var i = 0; i < weekDates.length; i++)
    {
      params = params.append('weekDates', weekDates[i]);
    }

    if (searchFilter)
    {
      if (searchFilter.searchString.trim() != "")
      {
        params = params.append('filterType', searchFilter.type.toString());
        params = params.append('searchString', searchFilter.searchString);
      }
    }

    const body = JSON.stringify(selectedLevels);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers),
      params: params
    };

    return this.httpClient.post<GenericResponseObject>(this.config.api_endpoint + 'booking/GenerateHoursMatrix/'
      + idCompany.toString(), body, options);
  }
  // getBookings(idCompany: number, idEntities: number[], dateLimits: string[]):Observable<GenericResponseObject>
  // {
  //   let params = new HttpParams();
  //   for (var i = 0; i < idEntities.length; i++)
  //   {
  //     params = params.append('idEntities', idEntities[i].toString());
  //   }
  //   for (var i = 0; i < dateLimits.length; i++)
  //   {
  //     params = params.append('dateLimits', dateLimits[i]);
  //   }

  //   let options = {
  //     headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
  //     params: params
  //   };

  //   return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'booking/GetBookings/' + idCompany.toString(), options);
  // }
  getBookingsByUser(idUser: number, date: Date): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('date', CommonServiceMethods.getDateString(date));

    let options = {
      headers: null,
      params
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'booking/GetBookingsByUser/' + idUser.toString(), options);
  }
  getBookingsByTimeSlot(idCompany: number, bookingDate: string, filterByLinkedEntityToUser: boolean=false): Observable<GenericResponseObject>
  {
    let params = new HttpParams();

    params = params.append('bookingDate', bookingDate);
    params = params.append('filterByLinkedEntityToUser', filterByLinkedEntityToUser.toString());

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'booking/GetBookingsByTimeSlot/' + idCompany.toString(), options);
  }
  removeBooking(idBooking: number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.httpClient.delete<GenericResponseObject>(this.config.api_endpoint + 'booking/' + idBooking.toString(), options);
  }
  cancelBooking(idBooking: number, withClientNotification: boolean = false)
  {
    let params = new HttpParams();
    params = params.append('withClientNotification', withClientNotification.toString());
    params = params.append('culture', this.currentCulture);

    let options = {
      headers: null,
      params: params
    };

    return this.httpClient.delete<GenericResponseObject>(this.config.api_endpoint + 'booking/CancelBooking/' + idBooking.toString(), options);
  }
}
