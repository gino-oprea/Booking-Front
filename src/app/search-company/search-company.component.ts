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
  private COMP_IMG = require("./img/company.jpg");

  companies: Company[] = [];
  images: Image[] = [];

  constructor(private injector: Injector,
    private companySearchService: CompanySearchService,
    private imageService:ImageService,
    private domSanitizationService: DomSanitizer)
  {
    super(injector,
      ['lblTest']
    );
    this.site = WebSites.Front;
    this.pageName = "Search Company";    
  }

  ngOnInit() 
  {
    this.logAction(null, false, Actions.View, "", "");
    
    this.route.queryParams.subscribe((queryParams: Params) =>
    {
      let flt = new CompanyFilter(null, queryParams['name'] != null ? queryParams['name'] : null,
        null,
        null,
        queryParams['idCountry'] != null ? queryParams['idCountry'] : null,
        queryParams['town'] != null ? queryParams['town'] : null);
      this.loadFilteredCompanies(flt);
    });
  }  
  loadFilteredCompanies(filter:CompanyFilter)
  {
    this.companySearchService.getCompanies(filter).subscribe(result =>
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
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error searching companies', ''));    
  }
  goToBooking(companyId:number, companyName:string)
  {
    this.router.navigate(['/companybooking', companyId, companyName.replace(/ /g, '')]);
  }
}
