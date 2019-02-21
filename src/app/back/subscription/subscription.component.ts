import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { CompanyActiveSubscription } from "app/objects/company-active-subscription";
import { CompanyActiveSubscriptionService } from '../../app-services/company-active-subscription.service';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { Level } from '../../objects/level';
import { SubscriptionObject } from '../../objects/subscription-object';
import { SubscriptionsService } from '../../app-services/subscriptions.service';

@Component({
  selector: 'bf-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent extends BaseComponent implements OnInit 
{
  selectedLevelId: number = null;
  selectedLevel: Level = new Level();

  compActiveSubscription: CompanyActiveSubscription = new CompanyActiveSubscription();
  showSubscriptionDialog = false;
  subscriptions: SubscriptionObject[] = [];  
  selectedSubscriptionPrice: string;

  constructor(private injector: Injector,
    private subscriptionService: CompanyActiveSubscriptionService)
  {
    super(injector, [
      'lblMonthlyBookings',
      'lblLevels',
      'lblEntitiesPerLevel',
      'lblOneMonth',
      'lblOneYear',
      'lblSubscriptions',
      'lblUnlimited'
    ]);
    
    this.site = WebSites.Back;
    this.pageName = "Subscription";
    
    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
  }

  ngOnInit() 
  {
    this.logAction(this.idCompany, false, Actions.View, "", "");
    this.loadSubscription(this.idCompany);    
  }
  loadAvailableSubscriptions(subscriptionType:string)
  {
    this.subscriptionService.getSubscriptionsForRenewUpgrade(this.idCompany,subscriptionType).subscribe(
        result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '') {
            this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
          }
          else {
            this.subscriptions = <SubscriptionObject[]>gro.objList;
            this.selectedSubscriptionPrice = this.subscriptions[0].upgradePrice == null ? (this.subscriptions[0].monthlyPrice == null ?
              this.subscriptions[0].id + '|monthly_0' :
              this.subscriptions[0].id + '|monthly_' + this.subscriptions[0].monthlyPrice) :
              this.subscriptions[0].id + (this.subscriptions[0].upgradeMonths == 1 ? '|monthly' : '|yearly') + '_' + this.subscriptions[0].upgradePrice;
          }
        },
        e => this.logAction(this.idCompany, true, Actions.Search, "http error getting subscriptions", ""));
  }
  loadSubscription(idCompany: number)
  {
    this.subscriptionService.getCompanyActiveSubscription(idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      } 
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load company active subscription');
        if (result.objList.length > 0)
        {
          this.compActiveSubscription = <CompanyActiveSubscription>result.objList[0];
          this.selectedLevelId = this.compActiveSubscription.companyLevels[0].id;
          this.selectedLevel = this.getLevel(this.selectedLevelId);
        }
      }
    })
  }
  renewCompanySubscription(idSubscription: number, amount: number, months: number)
  {
    this.subscriptionService.renewCompanySubscription(this.idCompany, idSubscription, amount, months).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }  
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'company subscription renewed');
        this.showPageMessage('success', 'Success', 'Subscription renewed');
        this.loadSubscription(this.idCompany);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error renewing company subscription', ''));
  }
  upgradeCompanySubscription(idSubscription: number, amount: number, months: number)
  {
    this.subscriptionService.upgradeCompanySubscription(this.idCompany, idSubscription, amount, months).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }  
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'company subscription upgraded');
        this.showPageMessage('success', 'Success', 'Subscription upgraded');
        this.loadSubscription(this.idCompany);
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error upgrading company subscription', ''));
  }
  getColor(value:number, maxValue:number)
  {
    return value >= maxValue && maxValue != null ? 'red' : 'green';
  }
  onDdlChangeLevel()
  {
    this.selectedLevel = this.getLevel(this.selectedLevelId);
  }
  showSubscriptionsDialog(isRenew: boolean)
  {
    this.loadAvailableSubscriptions(isRenew ? 'renew' : 'upgrade');
    this.showSubscriptionDialog = true;
  }

  getLevel(id: number): Level
  {
    for (var i = 0; i < this.compActiveSubscription.companyLevels.length; i++) 
    {
      if (this.compActiveSubscription.companyLevels[i].id == id)
        return this.compActiveSubscription.companyLevels[i];
    }    
  }

  renewUpgradeSubscription(type : string)
  {
    let subscriptionId = this.selectedSubscriptionPrice.substring(0, this.selectedSubscriptionPrice.indexOf('|'));
    let period = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('|')+1, this.selectedSubscriptionPrice.indexOf('_'));
    let price = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('_') + 1);
    let months = period == 'yearly' ? 12 : 1;
      
    try
    {
      if (type == 'renew')
        this.renewCompanySubscription(parseInt(subscriptionId), parseFloat(price), months);
      else
        this.upgradeCompanySubscription(parseInt(subscriptionId), parseFloat(price), months);      
      
      this.showSubscriptionDialog = false;
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Add, ex.message, 'error choosing subscription');
    }  
  }
}
