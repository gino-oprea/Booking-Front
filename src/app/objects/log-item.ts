
export class LogItem
{
    public idLog: number;
    public ip: string;
    public idUser: number;
    public email: string;
    public userFirstName: string;
    public userLastName: string;
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

    public apiHost: string;
    public apiPath: string;
    public apiMethod: string;
    public apiRequestBody: string;
    public apiCallDurationMilliseconds: number;
    public authToken: string;

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

        this.apiHost = "";
        this.apiPath = "";
        this.apiMethod = "";
        this.apiRequestBody = "";
        this.apiCallDurationMilliseconds = null;
        this.authToken = "";

        this.error = "";
        this.errorDetailed = "";
    }
}