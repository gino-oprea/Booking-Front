export class SpecialDay
{
  constructor(
    public id?: number,
    public idParent?: number,
    public day?: Date,
    public isEveryYear?: boolean,
    public workingHours?: string
  ) { }
}