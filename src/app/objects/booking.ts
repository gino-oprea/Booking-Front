import { BookingEntity } from "app/objects/booking-entity";

export class Booking
{
  constructor(
    public id?: number,
    public idCompany?: number,
    public entities?: BookingEntity[],
    public idUser?: number,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public email?: string,
    public startDate?: Date,
    public endDate?: Date,
    public startTime?: Date,
    public endTime?: Date,
    public bookingPrice?: number,
    public isPaidRetainer?: boolean,
    public isPaidFull?: boolean,
    public clientRating?: number,
    public clientReview?: string,
    public idStatus?: number
  ) { }
}