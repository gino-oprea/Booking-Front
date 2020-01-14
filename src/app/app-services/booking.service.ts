import { AppSettings } from './app-settings';
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

@Injectable()
export class BookingService
{

  constructor(private httpClient: HttpClient, private usersService: UsersService) { }

  getBookings(idCompany: number, dateStart: string, dateEnd: string, includeCanceled: boolean = false): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('dateStart', dateStart);
    params = params.append('dateEnd', dateEnd);
    params = params.append('includeCanceled', includeCanceled.toString());


    let options = {
      headers: null,
      params: params
    };

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/GetBookings/' + idCompany.toString(), options);
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

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Booking/GetBookingFilters/' + idCompany.toString(), options);
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

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/SetUpBookingFilterEntitiesWorkingHours/'
      + idCompany.toString(), body, options);
  }
  getBookingDefaultDuration(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Booking/GetBookingDefaultDuration/' + idCompany.toString(), options);
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

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/GetBookingRestrictions/' + idCompany.toString(), options);
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

    let options = {
      headers: headers
    };

    return this.httpClient.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking', body, options);
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

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)
    };

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking', body, options);
  }
  setBookingStatus(booking: Booking, idStatus: number): Observable<GenericResponseObject>
  {
    let sDate = CommonServiceMethods.addUserDateOffset(new Date(booking.startDate));
    let eDate = booking.endDate != null ? CommonServiceMethods.addUserDateOffset(new Date(booking.endDate)) : null;
    let sTime = booking.startTime != null ? CommonServiceMethods.addUserDateOffset(new Date(booking.startTime)) : null;
    let eTime = booking.endTime != null ? CommonServiceMethods.addUserDateOffset(new Date(booking.endTime)) : null;

    booking.startDate = sDate;
    booking.endDate = eDate;
    booking.startTime = sTime;
    booking.endTime = eTime;

    const body = JSON.stringify(booking);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers
    };

    return this.httpClient.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/SetBookingStatus/' + idStatus.toString(), body, options);
  }
  removePotentialBooking(idPotentialBooking: number)
  {
    //const body = JSON.stringify(potentialBooking);
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.httpClient.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/RemovePotentialBooking/' + idPotentialBooking.toString(), options);
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

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/AutoAssignEntitiesToBooking/'
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

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/GenerateHoursMatrix/'
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

  //   return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/GetBookings/' + idCompany.toString(), options);
  // }
  getBookingsByUser(idUser: number, date:Date): Observable<GenericResponseObject>
  {
    let params = new HttpParams();    
    params = params.append('date', CommonServiceMethods.getDateString(date));    

    let options = {
      headers: null,
      params
    };

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/GetBookingsByUser/' + idUser.toString(), options);
  }
  getBookingsByTimeSlot(idCompany: number, bookingDate: string): Observable<GenericResponseObject>
  {
    let params = new HttpParams();

    params = params.append('bookingDate', bookingDate);

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/GetBookingsByTimeSlot/' + idCompany.toString(), options);
  }
  removeBooking(idBooking: number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.httpClient.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/' + idBooking.toString(), options);
  }
  cancelBooking(idBooking: number, withClientNotification: boolean = false)
  {
    let params = new HttpParams();
    params = params.append('withClientNotification', withClientNotification.toString());

    let options = {
      headers: null,
      params: params
    };

    return this.httpClient.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'booking/CancelBooking/' + idBooking.toString(), options);
  }
}
