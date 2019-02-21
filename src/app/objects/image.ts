export class Image
{
  constructor(
    public id?: number,
    public idParent?: number,
    public img?: string,
    public isDefaultImage?: boolean
  ) { }
}