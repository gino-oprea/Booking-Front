
export class LogItem
{
    public idLog: number;
    public ip: string;
    public idUser: number;
    public email: string;
    public phone: string;
    public lastLoginDate: Date;
    public idCompany: number;
    public companyName: string;
    public idSite: number;
    public siteName: string;
    public pageName: string;
    public idAction: number;
    public actionName: string;
    public isError: boolean;
    public logDate: Date;
    public logErrorMessage: string;
    public logInfoMessage: string;

    public error: string;
    public errorDetailed: string;

    constructor()
    {
        this.idLog = null;
        this.idUser = null;
        this.email = "";
        this.phone = "";
        this.lastLoginDate = null;
        this.idCompany = null;
        this.companyName = "";
        this.idSite = null;
        this.siteName = "";
        this.pageName = "";
        this.idAction = null;
        this.actionName = "";
        this.isError = null;
        this.logDate = null;
        this.logErrorMessage = "";
        this.logInfoMessage = "";

        this.error = "";
        this.errorDetailed = "";
    }
}