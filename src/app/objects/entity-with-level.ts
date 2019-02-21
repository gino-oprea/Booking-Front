export class EntityWithLevel
{
  constructor(
    public id?: number,
    public entityName_RO?: string,
    public entityName_EN?: string,
    public entityDescription_RO?: string,
    public entityDescription_EN?: string,
    public entityDefaultServiceDuration?: number,
    public entityIdDurationType?: number,

    public idLevel?: number,
    public idCompany?: number,
    public orderIndex?: number,
    public levelName_RO?: string,
    public levelName_EN?: string,
    public idLevelType?: number,
    public isMultipleBooking?: boolean,
    public levelDefaultDuration?: number,
    public levelIdDurationType?: number
  ) { }
}