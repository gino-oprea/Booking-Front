export class EntityAdditionalCharacteristic
{
  constructor(
    public id?: number,
    public idLevel?: number,
    public idEntity?: number,
    public idValue?: number,
    public characteristicName_RO?: string,
    public characteristicName_EN?: string,
    public idFieldType?: number,
    public isFrontOption?: boolean,
    public textValue_RO?: string,
    public textValue_EN?: string,
    public numericValue?: number
  ) { }
}