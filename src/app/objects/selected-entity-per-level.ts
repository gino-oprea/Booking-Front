import { Image } from './image';
export class SelectedEntityPerLevel
{
  constructor(
    public idLevel?: number,
    public idEntity?: number,
    public idLevelType?: number,
    public images?: Image[]
  )
  { }
}