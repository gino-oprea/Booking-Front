export class User
{
  constructor(
    public id?: number,
    public email?: string,
    public idRole?: number,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public password?: string,
    public creationDate?: Date,
    public activationKey?: string,
    public isEnabled?: boolean,
    public lastLoginDate?: Date,
    public token?:string,
    public error?: string,
    public errorDetailed?: string
  ) { }
}