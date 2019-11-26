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

  public static DeepCopy(workingHours: WorkingHours): WorkingHours
  {
    let result: WorkingHours = new WorkingHours();
    result.id = workingHours.id;
    result.idParent = workingHours.idParent;
    result.name = workingHours.name;
    result.monday = new WorkingDay(workingHours.monday.workHours, new Date(workingHours.monday.date));
    result.tuesday = new WorkingDay(workingHours.tuesday.workHours, new Date(workingHours.tuesday.date));
    result.wednesday = new WorkingDay(workingHours.wednesday.workHours, new Date(workingHours.wednesday.date));
    result.thursday = new WorkingDay(workingHours.thursday.workHours, new Date(workingHours.thursday.date));
    result.friday = new WorkingDay(workingHours.friday.workHours, new Date(workingHours.friday.date));
    result.saturday = new WorkingDay(workingHours.saturday.workHours, new Date(workingHours.saturday.date));
    result.sunday = new WorkingDay(workingHours.sunday.workHours, new Date(workingHours.sunday.date));

    return result;
  }
}