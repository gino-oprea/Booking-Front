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

@Component({
  selector: 'bf-search-company',
  templateUrl: './search-company.component.html',
  styleUrls: ['./search-company.component.css']
})
export class SearchCompanyComponent extends BaseComponent implements OnInit 
{
  protected COMP_IMG = require("./img/company.jpg");

  companies: Company[] = [];
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
