import { WorkingDay } from '../objects/working-day';
import { Timeslot } from '../objects/timeslot';
export class SelectBookingHourTransferObject
{
  constructor(
    public workingDay?: WorkingDay,
    public bookingDayTimeslots?:Timeslot[][]
  ) { }
}