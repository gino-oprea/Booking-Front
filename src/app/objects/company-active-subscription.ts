import { Level } from './level';
export class CompanyActiveSubscription
{
  constructor(
    public subscriptionName?: string,
    public daysLeft?: number,
    public expiryDate?: Date,
    public bookingsThisMonth?: number,
    public companyLevelsNo?: number,
    public subscriptionMaxBookingsNo?: number,
    public subscriptionMaxLevelsNo?: number,
    public subscriptionMaxEntitiesPerLevelNo?:number,
    public companyLevels?: Level[]
  ) { }
}