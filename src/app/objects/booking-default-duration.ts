import { DurationType } from '../enums/enums';
export class BookingDefaultDuration
{
  constructor(
    public defaultDuration?: number,
    public durationType?:DurationType
  ) { }
}