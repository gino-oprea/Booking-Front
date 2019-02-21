import { Entity } from './entity';
import { LevelAsFilter } from './level-as-filter';
export class BookingFilter
{
  constructor(
    //public entitiesPerLevel?: Entity[][],
    public filteredLevels?: LevelAsFilter[],
    public allEntitiesPossibleCombinations?:Entity[][],
    public date?: Date
  ) { }
}