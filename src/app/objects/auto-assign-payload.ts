import { LevelAsFilter } from './level-as-filter';
import { Timeslot } from './timeslot';
export class AutoAssignPayload
{
  constructor(
    public selectedLevels?: LevelAsFilter[],
    public bookingDayTimeslots?: Timeslot[][]
  ) { }
}