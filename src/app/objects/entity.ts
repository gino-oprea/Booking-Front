import { EntityAdditionalCharacteristic } from './entity-additional-characteristic';
import { Image } from './image';
import { WorkingHours } from './working-hours';
export class Entity
{
  constructor(
    public id?: number,
    public idLevel?: number,
    public entityName_RO?: string,
    public entityName_EN?: string,
    public entityDescription_RO?: string,
    public entityDescription_EN?: string,
    public characteristics?: EntityAdditionalCharacteristic[],
    public images?: Image[],
    public defaultServiceDuration?: number,
    public idDurationType?: number,
    public defaultServicePrice?: number,
    public hasCustomWorkingHours?: boolean,
    public hasVariableProgramme?: boolean,
    public idCustomWorkingHours?: number,
    public maximumMultipleBookings?: number,
    public isEnabled?: boolean,
    public childEntityIds?: number[],

    public workingHours?: WorkingHours
  ) { }
}