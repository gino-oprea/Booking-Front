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
    result.monday = new WorkingDay(workingHours.monday.workHours, workingHours.monday.date ? new Date(workingHours.monday.date) : null);
    result.tuesday = new WorkingDay(workingHours.tuesday.workHours, workingHours.tuesday.date ? new Date(workingHours.tuesday.date) : null);
    result.wednesday = new WorkingDay(workingHours.wednesday.workHours, workingHours.wednesday.date ? new Date(workingHours.wednesday.date) : null);
    result.thursday = new WorkingDay(workingHours.thursday.workHours, workingHours.thursday.date ? new Date(workingHours.thursday.date) : null);
    result.friday = new WorkingDay(workingHours.friday.workHours, workingHours.friday.date ? new Date(workingHours.friday.date) : null);
    result.saturday = new WorkingDay(workingHours.saturday.workHours, workingHours.saturday.date ? new Date(workingHours.saturday.date) : null);
    result.sunday = new WorkingDay(workingHours.sunday.workHours, workingHours.sunday.date ? new Date(workingHours.sunday.date) : null);

    return result;
  }
}