import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Params } from '@angular/router';
import { CompanyFilter } from '../objects/company-filter';
import { Actions, WebSites } from '../enums/enums';
import { CompanySearchService } from '../app-services/company-search.service';
import { Company } from '../objects/company';
import { BaseComponent } from '../shared/base-component';
import { GenericResponseObject } from '../objects/generic-response-object';
import { ImageService } from '../app-services/image.service';
import { Image } from '../objects/image';
import { CompanyService } from '../app-services/company.service';

@Component({
  selector: 'bf-search-company',
  templateUrl: './search-company.component.html',
  styleUrls: ['./search-company.component.css']
})
export class SearchCompanyComponent extends BaseComponent implements OnInit 
{
  protected COMP_IMG = require("./img/company.png");

  companies: Company[] = [];
  favouritesIds: number[] = [];
  images: Image[] = [];
  emptySlotsNo: number = 10;

  constructor(private injector: Injector,
    private companySearchService: CompanySearchService,    
    private imageService: ImageService,
    protected domSanitizationService: DomSanitizer)
  {
    super(injector,
      [
        'lblCompanies',
        'lblCategory',
        'lblAddress',
        'lblCity',
        'lblYourCompanyHere'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "Search Company";
  }

  ngOnInit() 
  {
    super.ngOnInit();

    this.route.queryParams.subscribe((queryParams: Params) =>
    {
      let flt = new CompanyFilter(
        null,
        queryParams['name'] != null ? queryParams['name'] : null,
        queryParams['idCategory'] != null ? queryParams['idCategory'] : null,
        queryParams['idSubcategory'] != null ? queryParams['idSubcategory'] : null,
        queryParams['idCountry'] != null ? queryParams['idCountry'] : null,
        queryParams['idCounty'] != null ? queryParams['idCounty'] : null,
        queryParams['idCity'] != null ? queryParams['idCity'] : null
      );
      this.loadFilteredCompanies(flt);
    });

    this.loadFavourites();

    this.loginService.loginSubject.subscribe(res =>
    { 
      this.loadFavourites();
    });
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

  isAuth(): boolean
  {    
    return this.loginService.isAuthenticated();
  }  

  loadFilteredCompanies(filter: CompanyFilter)
  {
    this.companySearchService.getCompanies(filter).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        this.showPageMessage("error", "Error", gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'Search company: ' + JSON.stringify(filter));
        this.companies = <Company[]>gro.objList;

        this.emptySlotsNo = this.emptySlotsNo - this.companies.length < 0 ? 0 : this.emptySlotsNo - this.companies.length;

        this.companies.forEach(c =>
        {
          this.imageService.getCompanyImages(c.id).subscribe(result =>
          {
            c.image = result.objList;
          })
        });
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error searching companies', ''));
  }

  goToCompanyDetails(companyId: number, companyName: string)
  {
    this.router.navigate(['/companydetails', companyId, companyName.replace(/ /g, '')]);
  }

  dummyCompanyArray(n: number): any[]
  {
    return Array(n);
  }
}
