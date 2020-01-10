import { Image } from './image';

export class Company
{
  constructor(
    public id?: number,
    public idAccount?: number,
    public name?: string,
    public description_RO?: string,
    public description_EN?: string,
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
    public idCity?: number,
    public cityName?: string,
    public countyName?: string,    
    public address?: string,
    public lat?: number,
    public lng?: number,
    public image?: Image[],
    public dateCreated?: Date,
    public isEnabled?: boolean,
    public allowOnlineBookings?: boolean
  ) { }
}