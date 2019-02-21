export class GenericResponseObject
{
  constructor(
    public objList?: any[],
    public info?: string,
    public error?: string,
    public errorDetailed?: string
  ) { }
}