import { EntityWithLevel } from './entity-with-level';
export class AutoAssignedEntityCombination
{
  constructor(
    public idPotentialBooking?:number,
    public entityCombination?: EntityWithLevel[],
    public duration?: number
  ) { }
}