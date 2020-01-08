import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionsService } from '../app-services/subscriptions.service';
import { SubscriptionObject } from '../objects/subscription-object';
import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { Company } from '../objects/company';
import { WebSites, Actions, UserRoleEnum } from '../enums/enums';
import { GenericResponseObject } from '../objects/generic-response-object';
import { CompanyService } from '../app-services/company.service';
import { ImageService } from '../app-services/image.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'bf-my-companies',
  templateUrl: './my-companies.component.html',
  styles: []
})
export class MyCompaniesComponent extends BaseComponent implements OnInit
{
  public PLUS_IMG = require("./img/plus.png");
  public COMP_IMG = require("./img/company.jpg");

  companies: Company[];

  selectedCompany: Company;
  selectedCompanyIsEnabled: boolean;
  displayConfirmToggleCompany: boolean = false;
  confirmToggleEntityMessage: string;

  // showSubscriptionDialog = false;
  // subscriptions: SubscriptionObject[] = [];
  // selectedSubscriptionPrice: string;

  constructor(private injector: Injector,
    //private subscriptionsService: SubscriptionsService,
    private imageService: ImageService,
    private companyService: CompanyService,
    public domSanitizationService: DomSanitizer)
  {
    super(injector, [
      'lblMyCompanies',
      'lblMonthlyBookings',
      'lblLevels',
      'lblEntitiesPerLevel',
      'lblOneMonth',
      'lblOneYear',
      'lblSubscriptions',
      'lblUnlimited',
      'lblPhone',
      'lblTown',
      'lblEdit'
    ]);
    this.site = WebSites.Back;
    this.pageName = "My companies";
    this.idCompany = null;

    this.companyService.getCompanies(this.loginService.getCurrentUser().id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.companies = <Company[]>gro.objList;
        this.companies.forEach(c =>
        {
          this.imageService.getCompanyImages(c.id).subscribe(result =>
          {
            c.image = result.objList;
          })
        });
        console.log(this.companies);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting companies', ''));
  }

  ngOnInit()
  {
    super.ngOnInit();

    // try
    // {
    //   this.subscriptionsService.getSubscriptions().subscribe(
    //     result =>
    //     {
    //       let gro = <GenericResponseObject>result;
    //       if (gro.error != '')
    //       {
    //         this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
    //       }
    //       else
    //       {
    //         this.subscriptions = <SubscriptionObject[]>gro.objList;
    //         this.selectedSubscriptionPrice = this.subscriptions[0].monthlyPrice == null ?
    //           this.subscriptions[0].id + '|monthly_0' :
    //           this.subscriptions[0].id + '|monthly_' + this.subscriptions[0].monthlyPrice;
    //       }
    //     },
    //     e => this.logAction(this.idCompany, true, Actions.Search, "http error getting subscriptions", ""));
    // }
    // catch (ex)
    // {
    //   this.logAction(this.idCompany, true, Actions.Search, ex.message, "");
    // }
  }

  // onAddCompany()
  // {
  //   this.showSubscriptionDialog = true;
  // }

  // chooseSubscription()
  // {
  //   let selectedSubscription: SubscriptionObject = null;
  //   try
  //   {
  //     let subscriptionId = this.selectedSubscriptionPrice.substring(0, this.selectedSubscriptionPrice.indexOf('|'));
  //     let period = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('|') + 1, this.selectedSubscriptionPrice.indexOf('_'));
  //     let price = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('_') + 1);

  //     let months = period == 'yearly' ? 12 : 1;

  //     for (var i = 0; i < this.subscriptions.length; i++)
  //     {
  //       if (parseInt(subscriptionId) == this.subscriptions[i].id)
  //       {
  //         selectedSubscription = this.subscriptions[i];
  //         break;
  //       }
  //     }
  //     if (selectedSubscription != null)
  //       this.addNewCompany(selectedSubscription.id, parseFloat(price), months);
  //   }
  //   catch (ex)
  //   {
  //     this.logAction(this.idCompany, true, Actions.Add, ex.message, 'error choosing subscription');
  //   }
  // }
  // addNewCompany(idSubscription: number, amount: number, months: number)
  // {
  //   this.companyService.createCompany(this.loginService.getCurrentUser().id, idSubscription, amount, months)
  //     .subscribe(result =>
  //     {
  //       let gro = <GenericResponseObject>result;
  //       if (gro.error != '')
  //       {
  //         this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
  //       }
  //       else
  //       {
  //         //one time subscription - trebuie facut routing la noua companie abia dupa ce se emite noul token cu claim-urile corecte
  //         this.loginService.loginSubject.pipe(first()).subscribe(login =>
  //         {
  //           //route to new company  
  //           let idCompany = gro.info;

  //           this.logAction(parseInt(idCompany), false, Actions.Add, "", "", true, "Company added");

  //           this.router.navigate(['/company', idCompany, 'generaldetails']);
  //         });
  //         this.autoLogin();//mai sus e pregatit subscriptionul ca sa prinda schimbarea de token si sa faca routing-ul catre noua companie           
  //       }
  //     },
  //       err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding company', ''));
  // }
  editCompany(idCompany)
  {
    this.router.navigate(['/company', idCompany, 'generaldetails']);
  }
  toggleCompanyEnabled()//toggleCompanyEnabled(e, company: Company)
  {
    let isEnabled = this.selectedCompanyIsEnabled;//e.checked;
    let company = this.selectedCompany;
    
    company.isEnabled = isEnabled;
    //se pun null ca se se updateze doar cele de sus
    company.lat = null;
    company.lng = null;

    this.companyService.updateCompany(company).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        //this.showPageMessage('error', 'Error', gro.error);
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
      }
      else
      {
        //this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
        this.logAction(this.idCompany, false, Actions.Edit, '', '', true, this.getCurrentLabelValue('lblSaved'));
      }
    });
  }

  hasRolePermission(requiredRole: string, idCompany: number): boolean
  {
    let currentUser = this.loginService.getCurrentUser();
    let role = currentUser.roles.find(r => r.idCompany == idCompany);
    if (role.idRole <= UserRoleEnum[requiredRole])
      return true;
    else
      return false;
  }
  showToggleConfirm(e, company: Company)
  {
    this.selectedCompany = company;
    this.selectedCompanyIsEnabled = e.checked;
    this.confirmToggleEntityMessage = "Are you sure you want to " + (this.selectedCompanyIsEnabled ? "enable" : "disable") + " this company?";
    this.displayConfirmToggleCompany = true;
  }
  onConfirmToggle(message)
  {
    if (message == "yes")
      this.toggleCompanyEnabled();
    else
      this.selectedCompany.isEnabled = !this.selectedCompany.isEnabled;
    
    this.displayConfirmToggleCompany = false;
  }
}

