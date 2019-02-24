import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogItem } from '../objects/log-item';
import { Injector, OnDestroy } from '@angular/core';
import { WebSites, Actions } from '../enums/enums';
import { LoggerService } from '../app-services/logger.service';
import { Message } from 'primeng/primeng';
import { GenericResponseObject } from '../objects/generic-response-object';
import { User } from '../objects/user';
import { LabelsService } from '../app-services/labels.service';
import { Label } from '../objects/label';
import { UsersService } from '../app-services/users.service';

export class BaseComponent implements OnDestroy
{
    idCompany: number = null;
    pageName: string;
    pageMsgs: Message[] = [];
    site = WebSites.Front;
    pageLabels: string[] = [];

    usersService: UsersService;    
    loggerService: LoggerService;
    labelsService: LabelsService;
    router: Router;
    route: ActivatedRoute;
    currentLabels: Label[] = [];

    currentCulture: string = !!localStorage.getItem('b_front_culture') ? localStorage.getItem('b_front_culture') : 'RO'; 
    currentUser: User = null;
    subscription: Subscription;
    userSubscription: Subscription;
    routeSubscription: Subscription;

    calendarLocale_RO: any;
    calendarLocale_EN: any;
    

    constructor(injector: Injector,lbls:string[]) 
    {
        try
        {
            this.loggerService = injector.get(LoggerService);
            this.labelsService = injector.get(LabelsService);
            this.usersService = injector.get(UsersService);
            this.router = injector.get(Router);
            this.route = injector.get(ActivatedRoute);

            this.pageLabels = lbls;
            if (this.pageLabels.length > 0)
                this.getPageLabelsFromServer(this.pageLabels);
            
            
        
            this.usersService.emmitLoginChange();
            
            this.calendarLocale_RO = {
                firstDay: 1,
                dayNames: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"],
                dayNamesShort: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"],
                dayNamesMin: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"],
                monthNames: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
                monthNamesShort: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
                buttonText: { today: 'astazi' }
            };
            this.calendarLocale_EN = {
                firstDay: 1,
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                buttonText: { today: 'today' }
            };
           

            this.subscription = this.labelsService.cultureSubject.subscribe(culture =>
            {
                this.currentCulture = culture;  
                this.onChangeCulture();
            });
            this.userSubscription = this.usersService.loginSubject.subscribe(res =>
            {
                this.currentUser = this.usersService.getCurrentUser();
                this.redirectFromUnauthorizedPages();
            });
        }
        catch (e)
        {
            this.logAction(this.idCompany, true, Actions.View, e.message, 'error in base component constructor');
        }
    }

    redirectFromUnauthorizedPages()
    {
        // //in cazul in care suntem deja pe o pagina in timp ce se schimba conditiile 
        // //din route guards
        if (this.currentUser != null//daca user e logat
            && this.pageName == 'User registration')
        {
            this.router.navigate(['/searchcompany']);
        }
        // if (this.currentUser == null//daca userul nu e logat
        //     && (this.pageName == 'My account'
        //         || this.pageName == 'Change password'))
        // {
        //     this.router.navigate(['/searchcompany']);
        // }
    }
    getPageLabelsFromServer(labels: string[])
    {
        this.labelsService.getLabelsByKeyName(labels).subscribe(
            (result: Label[]) =>
            {
                this.currentLabels = result;
            },
            err => console.log(err));
    }
    getCurrentLabelValue(keyName:string):string
    {
        let currLabel = new Label();
        for (let i = 0; i < this.currentLabels.length; i++)
        {
            if (this.currentLabels[i].labelName == keyName)
            {
                currLabel = this.currentLabels[i];
                break;
            }
        }
        if (this.currentCulture == 'EN')
            return currLabel.en;
         else
             return currLabel.ro;       
    }
    getCurrentCalendarLocale()
    {
        if (this.currentCulture == 'EN')
            return this.calendarLocale_EN;
         else
             return this.calendarLocale_RO;   
    }
    onChangeCulture()
    {

    }

    logAction(idCompany: number, isError: boolean, idAction: number, errMsg: string, infoMsg: string)
    {
        try {
            let log = new LogItem();

            log.idUser = (!!localStorage.getItem('b_front_auth_user') ? (<User>JSON.parse(localStorage.getItem('b_front_auth_user'))).id : null);
            log.idCompany = idCompany;
            log.isError = isError;
            log.idSite = this.site;
            log.pageName = this.pageName;
            log.idAction = idAction;
            log.logErrorMessage = errMsg;
            log.logInfoMessage = infoMsg;

            //console.log(log);

            this.loggerService.setLog(log).subscribe((data: any) =>
            {
                let gro = <GenericResponseObject>data;
                //console.log(gro);
            },
                err => console.log(err));
        }
        catch (e) {
            //console.log(e);
        }

    }

    showPageMessage(severity: string, summary: string, message: string)
    {
      this.pageMsgs = [];
      this.pageMsgs.push({ severity: severity, summary: summary, detail: message });
    }

    ngOnDestroy(): void 
    {
        this.subscription.unsubscribe();
        this.userSubscription.unsubscribe();

        if (this.routeSubscription != null)
            this.routeSubscription.unsubscribe();
    }


}