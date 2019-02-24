import { Image } from './image';

export class Company
{
  constructor(
    public id?: number,
    public idAccount?: number,
    public name?: string,
    public description?: string,
    public idCategory?: number,
    public categoryName_RO?: string,
    public categoryName_EN?: string,
    public idSubcategory?: number,
    public subcategoryName_RO?: string,
    public subcategoryName_EN?: string,
    public email?: string,
    public phone?: string,
    public idCountry?: number,
    public countryName?: string,
    public idCounty?: number,
    public countyName?: string,
    public town?: string,
    public address?: string,
    public lat?: number,
    public lng?: number,
    public image?: Image[],
    public dateCreated?: Date,
    public isEnabled?: boolean
  ) { }
}