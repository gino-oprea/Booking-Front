export class BookingEntity
{
  constructor(
    public idEntity?: number,
    public isAutoAssigned?: boolean,    
    public idLevel?: number,
    public isMultipleBooking?: boolean,
    
    public entityName_RO?: string,
    public entityName_EN?: string,
    public levelName_RO?: string,
    public levelName_EN?: string,
  )
  { }
}