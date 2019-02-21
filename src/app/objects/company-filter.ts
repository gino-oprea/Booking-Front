export class CompanyFilter
{
  constructor(
    public id?: number,
    public name?: string,
    public idCategory?: number,
    public idSubcategory?: number,
    public idCountry?: number,
    public town?: string
  )
  { }
}