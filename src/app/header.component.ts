import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from './shared/base-component';
import { WebSites, Actions } from './enums/enums';
import { UsersService } from './app-services/users.service';
import { User } from './objects/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenericResponseObject } from './objects/generic-response-object';
import { CompanySearchService } from './app-services/company-search.service';
import { Country } from './objects/country';
import { CountriesService } from './app-services/countries.service';
import { Token } from './objects/token';
import * as jwt_decode from 'jwt-decode';
import { County } from './objects/county';
import { City } from './objects/city';
import { SubscriptionsService } from './app-services/subscriptions.service';
import { CompanyService } from './app-services/company.service';
import { SubscriptionObject } from './objects/subscription-object';
import { first } from 'rxjs/operators';
import { GenericDictionaryItem } from './objects/generic-dictionary-item';
import { Company } from './objects/company';

@Component({
  selector: 'bf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit 
{


  public COMP_LOGO = require("./img/logo.png");

  cultures: SelectItem[];
  selectedCulture: string = !!localStorage.getItem('b_front_culture') ? localStorage.getItem('b_front_culture') : 'RO';
  loginForm: FormGroup;
  displayDialog: boolean = false;

  searchString: string = "";
  countriesDic: Country[] = [];
  countiesDic: County[] = [];
  citiesDic: City[] = [];

  selectedCountryId: number = 1;
  selectedCountyId: number = 0;
  selectedCityId: number = 0;

  selectedCategoryId: number = 0;
  selectedSubcategoryId: number = 0;

  categories: GenericDictionaryItem[] = [];
  subcategories: GenericDictionaryItem[] = [];

  showSubscriptionDialog = false;
  subscriptions: SubscriptionObject[] = [];
  selectedSubscriptionPrice: string;

  displayConfirmAddCompany: boolean = false;
  confirmAddCompanyMessage: string = "This will create a new company. Are you sure?";

  resetCaptcha: boolean = true;
  addCompanyForm: FormGroup;

  constructor(private injector: Injector,
    private confirmationService: ConfirmationService,
    private companySearchService: CompanySearchService,
    private countriesService: CountriesService,
    private subscriptionsService: SubscriptionsService)
  {
    super(injector,
      [
        'lblSearch',
        'lblSearchCompany',
        'lblInvalidEmail',
        'lblPassword',
        'lblRegister',
        'lblForgotPassword',
        'lblHttpError',
        'lblAccountDetails',
        'lblMyCompanies',
        'lblMyBookings',
        'lblChangePassword',
        'lblConfirmation',
        'lblConfirmForgotPassword',
        'lblResetPasswordEmailSent',
        'lblYes',
        'lblNo',
        'lblCreateNewCompany',
        'lblAllCounties',
        'lblAllCities',
        'lblConfirmCreateNewCompany',

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
        'lblAllCategories',
        'lblAllSubcategories',
        'lblCompanyAdded',
        'lblFavourites',
        'lblDescription',
        'lblSave',
        'lblCompanyName'
      ]
    );

    this.site = WebSites.Front;
    this.pageName = "Site Header Menu";

    this.cultures = [{ label: 'RO', value: 'RO' }, { label: 'EN', value: 'EN' }];

    console.log(this.currentUser);

    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'password': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() 
  {
    this.loadSubscriptions();

    this.initFormAddCompany();

    //this.loadCountries();
    this.loadCounties();
    this.loadCities();

    this.loadCategories();
    this.loadSubCategories();
  }
  initFormAddCompany()
  {
    this.addCompanyForm = new FormGroup({
      'addCompanyName': new FormControl('', Validators.required),
      'addCompanyDescription_RO': new FormControl('', Validators.required),
      'addCompanyDescription_EN': new FormControl('', Validators.required)
    });
  }
  loadCountries()
  {
    this.countriesDic = [];
    this.countriesService.getCountries().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.countriesDic = <Country[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error loading countries dictionary', ''));
  }
  loadCounties()
  {
    this.countiesDic = [];
    this.countriesService.getCounties(this.selectedCountryId).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.countiesDic = <County[]>gro.objList;
      }
    });
  }
  loadCities()
  {
    if (this.selectedCountyId != 0)
    {
      this.selectedCityId = 0;
      this.citiesDic = [];
      this.countriesService.getCities(this.selectedCountyId).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
          this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        else
        {
          this.citiesDic = <City[]>gro.objList;
        }
      });
    }
    else
    {
      this.selectedCityId = 0;
      this.citiesDic = [];
    }
  }
  loadCategories()
  {
    this.companyService.getActivityCategories().subscribe(groCategories =>
    {
      if (groCategories.error != '')
        this.logAction(this.idCompany, true, Actions.Search, groCategories.error, groCategories.errorDetailed, true);
      else
      {
        this.categories = <GenericDictionaryItem[]>groCategories.objList;
      }
    });
  }
  loadSubCategories()
  {
    this.companyService.getActivitySubCategories(this.selectedCategoryId).subscribe(groSubcategories =>
    {
      if (groSubcategories.error != '')
        this.logAction(this.idCompany, true, Actions.Search, groSubcategories.error, groSubcategories.errorDetailed, true);
      else
      {
        this.subcategories = <GenericDictionaryItem[]>groSubcategories.objList;
        if (this.subcategories.length == 0)
          this.selectedSubcategoryId = 0;
      }
    });
  }
  onChangeCategory()
  {
    this.loadSubCategories();
  }
  getMyAccountText()
  {
    let myAccountText: string;
    if (this.currentUser != null && this.currentUser.email != '')
    {
      myAccountText = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    }
    else
      myAccountText = 'Login';

    return myAccountText;
  }
  onLogin()
  {
    this.loginService.login(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value, this).subscribe((token: Token) =>
      {
        this.logAction(null, false, Actions.Login, "", "Login user " + this.loginForm.controls['email'].value);

        this.loginForm.reset();
      },
        err =>
        {
          this.logAction(null, true, Actions.Login, "invalid login", 'invalid login', true);
        });
  }
  onLogout()
  {
    try//
    {
      this.logAction(null, false, Actions.Logout, "", "Logout user: " + this.loginService.getCurrentUser().email);

      this.loginService.logout();
      this.router.navigate(['/searchcompany']);
      //this.router.navigate(['/login']);
    }
    catch (ex)//
    {
      this.logAction(null, true, Actions.Logout, ex.message, "");
    }

  }
  isAuth(): boolean
  {
    return this.loginService.isAuthenticated();
  }
  onCultureChange()
  {
    try
    {
      this.labelsService.emmitCultureChange(this.selectedCulture);
      this.logAction(this.idCompany, false, Actions.Edit, "", "culture change to " + this.selectedCulture);
    }
    catch (e)
    {
      this.logAction(null, true, Actions.Search, e.message, 'error changing culture');
    }
  }
  displayConfirmDialog()
  {
    if (this.loginForm.controls['email'].valid)
      this.displayDialog = true;
    else
      this.showPageMessage("warn", "Warning", this.getCurrentLabelValue('lblInvalidEmail'));
  }
  onForgotPassword()
  {
    this.displayDialog = false;
    try
    {
      this.usersService.resetUserPasswordByEmail(this.loginForm.controls['email'].value)
        .subscribe((response: GenericResponseObject) =>
        {
          if (response.info.indexOf('success') > -1)
          {
            this.showPageMessage("success", "Success", this.getCurrentLabelValue('lblResetPasswordEmailSent'));
            this.logAction(null, false, Actions.Edit, "", "password reset");
          }
          else
          {
            this.showPageMessage("error", "Error", response.error);
            this.logAction(null, true, Actions.Edit, response.error, "error forgot password: " + response.errorDetailed);
          }
        },
          err => this.logAction(null, true, Actions.Edit, "http error resetting password", ""));
    }
    catch (e)
    {
      this.logAction(null, true, Actions.Edit, e.message, "error reset password");
    }
  }

  doSearch()
  {
    this.router.navigate(['/searchcompany'], {
      queryParams: {
        name: this.searchString.trim(),
        idCountry: this.selectedCountryId != 1 ? this.selectedCountryId : null,
        idCounty: this.selectedCountyId != 0 ? this.selectedCountyId : null,
        idCity: this.selectedCityId != 0 ? this.selectedCityId : null,
        idCategory: this.selectedCategoryId != 0 ? this.selectedCategoryId : null,
        idSubcategory: this.selectedSubcategoryId != 0 ? this.selectedSubcategoryId : null
      }
    });
  }
  onAddNewCompany()
  {
    if (this.loginService.getCurrentUser() != null)
      this.displayConfirmAddCompany = true;//this.showSubscriptionDialog = true;
    else
      this.router.navigate(['/login']);
  }
  onConfirmAddCompany(message)
  {
    if (message == "yes")
    {
      this.addNewCompany(this.subscriptions[0].id, 0, 12);
    }

    this.displayConfirmAddCompany = false;
  }
  onAddCompanyForm()
  {
    let comp = new Company();
    comp.name = this.addCompanyForm.controls["addCompanyName"].value;
    comp.description_RO = this.addCompanyForm.controls["addCompanyDescription_RO"].value;
    comp.description_EN = this.addCompanyForm.controls["addCompanyDescription_EN"].value;

    this.addNewCompany(this.subscriptions[0].id, 0, 12, comp);
    this.displayConfirmAddCompany = false;
    this.addCompanyForm.reset();
  }
  loadSubscriptions()
  {
    this.subscriptionsService.getSubscriptions().subscribe(
      result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        }
        else
        {
          this.subscriptions = <SubscriptionObject[]>gro.objList;
          this.selectedSubscriptionPrice = this.subscriptions[0].monthlyPrice == null ?
            this.subscriptions[0].id + '|monthly_0' :
            this.subscriptions[0].id + '|monthly_' + this.subscriptions[0].monthlyPrice;
        }
      });
  }
  chooseSubscription()
  {
    let selectedSubscription: SubscriptionObject = null;
    try
    {
      let subscriptionId = this.selectedSubscriptionPrice.substring(0, this.selectedSubscriptionPrice.indexOf('|'));
      let period = this.selectedSubscriptionPrice.substring(this.selectedSubscriptionPrice.indexOf('|') + 1, this.selectedSubscriptionPrice.indexOf('_'));
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
  addNewCompany(idSubscription: number, amount: number, months: number, company?:Company)
  {
    this.companyService.createCompany(this.loginService.getCurrentUser().id, idSubscription, amount, months, company)
      .subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
        }
        else
        {
          //one time subscription - trebuie facut routing la noua companie abia dupa ce se emite noul token cu claim-urile corecte
          this.loginService.loginSubject.pipe(first()).subscribe(login =>
          {
            //route to new company  
            let idCompany = gro.info;

            this.logAction(parseInt(idCompany), false, Actions.Add, "", "", true, this.getCurrentLabelValue('lblCompanyAdded'));

            this.showSubscriptionDialog = false;

            this.router.navigate(['/company', idCompany, 'generaldetails']);
          });
          this.autoLogin();//mai sus e pregatit subscription-ul ca sa prinda schimbarea de token si sa faca routing-ul catre noua companie           
        }
      },
        err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding company', ''));
  }
  onCloseAddCompanyDialog()
  {
    this.resetCaptcha = !this.resetCaptcha;

    this.addCompanyForm.reset();
  }
}
