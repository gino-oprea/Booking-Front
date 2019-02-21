import { WorkingDay } from './working-day';
export class WorkingHours
{
  constructor(
    public id?: number,
    public idParent?: number,
    public name?: string,    
    public monday?: WorkingDay,
    public tuesday?: WorkingDay,
    public wednesday?: WorkingDay,
    public thursday?: WorkingDay,
    public friday?: WorkingDay,
    public saturday?: WorkingDay,
    public sunday?: WorkingDay
  ) { }
}