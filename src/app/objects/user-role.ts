import { SiteModule } from "./site-module";

export class UserRole
{
  constructor(    
    public idRole?: number,
    public roleName?: string,
    public idCompany?: number,
    public idUser?: number,

    public companyName?: string,   

    public isEditable?: boolean,
    public isOption?: boolean,
    public isCompanyOwner?: boolean
  ) { }
}
export class UserRoleWithModules extends UserRole
{
  constructor(
    public siteModules?: SiteModule[]
  )
  {
    super();
  }
}