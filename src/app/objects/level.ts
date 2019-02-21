export class Level
{
  constructor(
    public id?: number,
    public idCompany?: number,
    public orderIndex?: number,
    public levelName_RO?: string,
    public levelName_EN?: string,
    public idLevelType?: number,
    public isFrontOption?: boolean,
    public isMultipleBooking?: boolean,
    public defaultDuration?: number,
    public idDurationType?: number,
    public entitiesNo?: number
  ) { }

}