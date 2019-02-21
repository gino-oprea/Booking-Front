import { Booking } from './booking';
export class Timeslot
{
  constructor(
    public startTime?: Date,
    public endTime?: Date,
    public isSelectable?: boolean,
    public isSelected?: boolean,
    public bookings?: Booking[],
    public isBooked?:boolean,
    public isFullBooked?: boolean,
    public hasFilteredBooking?: boolean
  ) { }
}