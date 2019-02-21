import { BookingFilterType } from "../enums/enums";

export class BookingSearchFilter
{
  constructor(
    public searchString?: string,
    public type?: BookingFilterType
  ) { }
}