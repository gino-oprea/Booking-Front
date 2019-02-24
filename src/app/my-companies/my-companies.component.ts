import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionsService } from '../app-services/subscriptions.service';
import { SubscriptionObject } from '../objects/subscription-object';
import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { Company } from '../objects/company';
import { WebSites, Actions } from '../enums/enums';
import { GenericResponseObject } from '../objects/generic-response-object';
import { CompanyService } from '../app-services/company.service';
import { ImageService } from '../app-services/image.service';

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
  selectedCompany: any;
  showSubscriptionDialog = false;
  subscriptions: SubscriptionObject[] = [];
  selectedSubscriptionPrice: string;

  constructor(private injector: Injector,
    private subscriptionsService: SubscriptionsService,
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

    this.companyService.getCompanies(this.usersService.getCurrentUser().id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
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
    this.logAction(this.idCompany, false, Actions.View, "", "");
    
    try {
      this.subscriptionsService.getSubscriptions().subscribe(
        result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '') {
            this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
          }
          else {
            this.subscriptions = <SubscriptionObject[]>gro.objList;
            this.selectedSubscriptionPrice = this.subscriptions[0].monthlyPrice == null ?
              this.subscriptions[0].id + '|monthly_0' :
              this.subscriptions[0].id + '|monthly_' + this.subscriptions[0].monthlyPrice;
          }
        },
        e => this.logAction(this.idCompany, true, Actions.Search, "http error getting subscriptions", ""));
    }
    catch (ex) {
      this.logAction(this.idCompany, true, Actions.Search, ex.message, "");
    }
  }

  onAddCompany()
  {
    this.showSubscriptionDialog = true;
  }

  chooseSubscription()
  {
    let selectedSubscription: SubscriptionObject = null;
    try
    {
      let subscriptionId = this.selectedSubscriptionPrice.substring(0, this.selectedSubscriptionPrice.indexOf('|'));
      let period = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('|')+1, this.selectedSubscriptionPrice.indexOf('_'));
      let price = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('_') + 1);

      let months = period == 'yearly' ? 12 : 1;
      
      for (var i = 0; i < this.subscriptions.length; i++)
      {
        if (parseInt(subscriptionId) == this.subscriptions[i].id)
        {
          selectedSubscription = this.subscriptions[i];
          break;
        }
      }
      if (selectedSubscription != null)
        this.addNewCompany(selectedSubscription.id, parseFloat(price), months);      
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Add, ex.message, 'error choosing subscription');
    }   
  }
  addNewCompany(idSubscription:number,amount:number,months:number)
  {
    this.companyService.createCompany(this.usersService.getCurrentUser().id, idSubscription, amount, months)
      .subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '') {
          this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed);
          this.showPageMessage('error', 'Error', gro.error);
        }
        else
        {
          //route to new company
          let idCompany = gro.info;
          this.router.navigate(['/company', idCompany, 'generaldetails']);
        }  
      },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding company', ''));
  }
  editCompany(idCompany)
  {
    this.router.navigate(['/company', idCompany, 'generaldetails']);
  } 
  toggleCompanyEnabled(e)
  {
    let isEnabled = e.checked;
  }
}
