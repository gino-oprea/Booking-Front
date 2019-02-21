import { EntityAdditionalCharacteristic } from './entity-additional-characteristic';
export class LevelAdditionalCharacteristic
{
  constructor(
    public id?: number,
    public idLevel?: number,
    public characteristicName_RO?: string,
    public characteristicName_EN?: string,
    public idFieldType?: number,
    public levelFieldType_RO?: string,
    public levelFieldType_EN?: string,
    public isFrontOption?: boolean,
    public characteristicValues?: EntityAdditionalCharacteristic[]
  ) { }
}