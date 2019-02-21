import { BookingEntity } from './booking-entity';
export class PotentialBooking
{
  constructor(
    public id?: number,
    public idCompany?: number,    
    public entities?: BookingEntity[],
    public idUser?: number,
    public startDate?: string,
    public endDate?: string,    
    public startTime?: string,
    public endTime?:string,
    public creationDate?: string
  ) { }
}