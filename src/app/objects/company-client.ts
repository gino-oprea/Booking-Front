export class CompanyClient
{
  constructor(
    public email?: string,
    public phone?: string,
    public firstName?: string,
    public lastName?: string,
    public totalBookings?: number,
    public activeBookings?: number,
    public honoredBookings?: number,
    public canceledBookings?: number
  ) { }
}