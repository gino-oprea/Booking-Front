import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { CompanyService } from '../app-services/company.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WebSites, Actions } from '../enums/enums';
import { CompanySearchService } from '../app-services/company-search.service';
import { CompanyFilter } from '../objects/company-filter';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';
import { Image } from '../objects/image';
import { ImageService } from '../app-services/image.service';

@Component({
  selector: 'bf-favourite-companies',
  templateUrl: './favourite-companies.component.html',
  styleUrls: ['./favourite-companies.component.css']
})
export class FavouriteCompaniesComponent extends BaseComponent implements OnInit {

  protected COMP_IMG = require("../search-company/img/company.png");
 
  companies: Company[] = [];
  favouritesIds: number[] = [];
  images: Image[] = [];

  constructor(private injector: Injector,
    private companyService: CompanyService,   
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
        'lblFavourites',
        'lblNoFavourites'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "Favourite Companies";
  }

  ngOnInit()
  {
    super.ngOnInit();
    this.loadFavourites();
  }

  loadFavourites()
  {
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
        let flt = new CompanyFilter();
        this.loadFilteredCompanies(flt);
      }
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
        this.logAction(this.idCompany, false, Actions.Search, '', 'Load favourites');
        let allComp = <Company[]>gro.objList;
        
        this.companies = allComp.filter(comp => this.favouritesIds.find(favId => favId == comp.id) != null);

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
  
  deleteFavourite(idComp: number, event: MouseEvent)
  {
    event.stopPropagation();
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
