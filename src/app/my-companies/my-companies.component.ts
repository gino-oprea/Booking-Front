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
  public COMP_IMG = require("./img/company.png");

  companies: Company[];
  favouritesIds: number[] = [];
  
  selectedCompany: Company;
  selectedCompanyIsEnabled: boolean;
  displayConfirmToggleCompany: boolean = false;
  confirmToggleEntityMessage: string;

  displayConfirmAllowBookingsCompany: boolean = false;
  confirmAllowBookingsMessage: string;
  selectedCompanyAllowBookings: boolean;

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
      'lblEdit',
      'lblAllowOnlineBookings',
      'lblEnabled',
      'lblAreYouSure',
      'lblToEnable',
      'lblToDisable',
      'lblThisCompany',
      'lblFor',
      'lblAllowOnlineBookingsMessage',
      'lblNot'
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
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting companies', ''));
  }

  ngOnInit()
  {
    super.ngOnInit();
    this.loadFavourites();
  }


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
        this.logAction(company.id, true, Actions.Edit, gro.error, gro.errorDetailed, true);
      }
      else
      {
        //this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
        this.logAction(company.id, false, Actions.Edit, '', 'Toggle company ' + (company.isEnabled ? 'enabled' : 'disabled'), true, this.getCurrentLabelValue('lblSaved'));
      }
    });
  }

  // hasRolePermission(requiredRole: string, idCompany: number): boolean
  // {
  //   let currentUser = this.loginService.getCurrentUser();
  //   let role = currentUser.roles.find(r => r.idCompany == idCompany);
  //   if (role.idRole <= UserRoleEnum[requiredRole])
  //     return true;
  //   else
  //     return false;
  // }
  hasModulePermission(requiredModule: string, idCompany: number): boolean
  {
    let siteModule = this.currentUser.rolesWithModules.find(r => r.idCompany == idCompany && r.siteModules.find(m => m.name == requiredModule) != null);
    if (siteModule != null)
      return true;
    else
      return false;
  }


  showToggleConfirm(e, company: Company)
  {
    this.selectedCompany = company;
    this.selectedCompanyIsEnabled = e.checked;
    this.confirmToggleEntityMessage = this.getCurrentLabelValue('lblAreYouSure') + " "
      + (this.selectedCompanyIsEnabled ? this.getCurrentLabelValue('lblToEnable') : this.getCurrentLabelValue('lblToDisable'))
      + " " + this.getCurrentLabelValue('lblThisCompany') + "?";
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

  showAllowBookingsConfirm(e, company: Company)
  {
    this.selectedCompany = company;
    this.selectedCompanyAllowBookings = e.checked;
    this.confirmAllowBookingsMessage = this.getCurrentLabelValue('lblAreYouSure') + " "
      + (this.selectedCompanyAllowBookings ? this.getCurrentLabelValue('lblAllowOnlineBookingsMessage') : this.getCurrentLabelValue('lblNot') + " " + this.getCurrentLabelValue('lblAllowOnlineBookingsMessage'))
      + " " + this.getCurrentLabelValue('lblFor') + " " + this.getCurrentLabelValue('lblThisCompany') + "?";
    this.displayConfirmAllowBookingsCompany = true;
  }
  onConfirmAllowBookings(message)
  {
    if (message == "yes")
      this.toggleCompanyAllowOnlineBookings();
    else
      this.selectedCompany.allowOnlineBookings = !this.selectedCompany.allowOnlineBookings;

    this.displayConfirmAllowBookingsCompany = false;
  }
  toggleCompanyAllowOnlineBookings()
  {
    let allowBookings = this.selectedCompanyAllowBookings;//e.checked;
    let company = this.selectedCompany;

    company.allowOnlineBookings = allowBookings;
    //se pun null ca se se updateze doar cele de sus
    company.lat = null;
    company.lng = null;

    this.companyService.updateCompany(company).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(company.id, true, Actions.Edit, gro.error, gro.errorDetailed, true);
      else
        this.logAction(company.id, false, Actions.Edit, '', 'Toggle company '+ (company.allowOnlineBookings ? 'allow' : 'not allow')+' online bookings', true, this.getCurrentLabelValue('lblSaved'));
    });
  }


  isAuth(): boolean
  {
    return this.loginService.isAuthenticated();
  }
  loadFavourites()
  {
    if (this.isAuth())
      this.companyService.getFavouriteCompanies().subscribe(gro =>
      {
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
          this.showPageMessage("error", "Error", gro.error);
        }
        else
        {
          this.favouritesIds = <number[]>gro.objList;
        }
      });
  }

  isFavourite(idComp: number): boolean
  {
    let exists: boolean = false;
    this.favouritesIds.find(fId => fId == idComp) != null ? exists = true : exists = false;

    return exists;
  }

  toggleFavourite(idComp: number, event: MouseEvent)
  {
    event.stopPropagation();
    if (this.isFavourite(idComp))
      this.deleteFavourite(idComp);
    else
      this.setFavourite(idComp);
  }
  setFavourite(idComp: number)
  {
    this.companyService.setFavouriteCompany(idComp).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
        this.showPageMessage("error", "Error", gro.error);
      }
      else
      {
        this.loadFavourites();
      }
    });
  }
  deleteFavourite(idComp: number)
  {
    this.companyService.deleteFavouriteCompany(idComp).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
        this.showPageMessage("error", "Error", gro.error);
      }
      else
      {
        this.loadFavourites();
      }
    });
  }
}

