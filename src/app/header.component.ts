import { SelectItem,ConfirmationService } from 'primeng/primeng';
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

@Component({
  selector: 'bf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit 
{

  cultures: SelectItem[];
  selectedCulture: string = !!localStorage.getItem('b_front_culture') ? localStorage.getItem('b_front_culture') : 'RO'; 
  loginForm: FormGroup;
  displayDialog: boolean = false;

  searchString: string = "";
  countriesDic: Country[] = [];
  townsDic: string[] = [];
  selectedCountryId: number = 1;  
  selectedTownId: number = 0;  
  
  constructor(private injector: Injector,
    private confirmationService: ConfirmationService,
    private companySearchService: CompanySearchService,
    private countriesService:CountriesService)
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
        'lblNo'
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
    this.loadCountries();
    this.loadTowns();
  }
  loadCountries()
  {
    this.countriesDic = [];
    this.countriesService.getCountries().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
      else
      {
        this.countriesDic = <Country[]>gro.objList;        
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error loading countries dictionary', ''));
  }
  loadTowns()
  {
    this.selectedTownId = 0;//pentru ca n-am id-uri pentru orase, doar indexuri
    this.townsDic = [];
    this.countriesService.getTowns(this.selectedCountryId).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
      else
      {
        this.townsDic = <string[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error loading countries dictionary', ''));
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
        this.loginForm.reset();        
      },
        err =>
        {
          console.log(err);
          this.showPageMessage("error", "Error", err.message);
          this.logAction(null, true, Actions.Login, "http request error", err.message);
        });
  }
  onLogout()
  {
    this.logAction(null, false, Actions.Logout, "", "");
    try//
    {
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
    try {
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
    catch (e) {
      this.logAction(null, true, Actions.Edit, e.message, "error reset password");
    }
  }

  doSearch()
  {      
    this.router.navigate(['/searchcompany'], {
      queryParams: {
        name: this.searchString.trim(),
        idCountry: this.selectedCountryId != 1 ? this.selectedCountryId : null,
        town: this.selectedTownId != 0 ? this.townsDic[this.selectedTownId - 1] : null
      }
    });    
  }
}
