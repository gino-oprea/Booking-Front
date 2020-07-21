import { Component, OnInit, Injector, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { basename } from 'path';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';
import { Image } from '../objects/image';
import { ImageService } from '../app-services/image.service';
import { CompanySearchService } from 'app/app-services/company-search.service';
import { WorkingHours } from '../objects/working-hours';
import { CompanyService } from '../app-services/company.service';

@Component({
  selector: 'bf-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent extends BaseComponent implements OnInit
{

  @ViewChild('map', { static: false }) map;

  public COMP_IMG = require("../img/company.png");

  companyName: string = '';
  company: Company;
  images: Image[] = [];
  selectedImage: Image = null;
  displayImageDialog = false;
  iframe: boolean;

  companyWorkingHours: WorkingHours;

  mapOptions = {
    center: { lat: 45.951249, lng: 24.793491 },
    zoom: 5
  };
  gMapOverlays: any[] = [];



  constructor(private injector: Injector,
    private companySearchService: CompanySearchService,
    private companyService: CompanyService,
    private imageService: ImageService)
  {
    super(injector,
      ['lblName',
        'lblDescription',
        'lblCategory',
        'lblSubCategory',
        'lblCountry',
        'lblCity',
        'lblCounty',
        'lblWorkingHours',
        'lblAddress',
        'lblPhone',
        'lblCompanyDetails',
        'lblCompanyNotAllowBookings',
        'lblBookNow'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "Company Details Front";

    this.routeSubscription = this.route.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
      if (params.hasOwnProperty('companyname'))
      {
        this.companyName = params['companyname'];
      }
    });

    this.routeSubscription = this.route.queryParams.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('iframe'))
        this.iframe = params['iframe'].toString().toLowerCase() == 'true';
      else
        this.iframe = false;
    });
  }

  ngOnInit() 
  {
    super.ngOnInit();
    this.loadCompany();
    this.loadCompanyWorkingHours();
    this.loadCompanyImages();
  }


  goToBooking(companyId: number, companyName: string)
  {
    if (this.iframe)
      this.router.navigate(['/companybooking', companyId, companyName.replace(/ /g, '')], { queryParams: { iframe: 'true' } });
    else
      this.router.navigate(['/companybooking', companyId, companyName.replace(/ /g, '')]);
  }

  loadCompany()
  {
    this.companySearchService.getCompany(null, this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        //this.showPageMessage('error', 'Error', gro.error);
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.company = <Company>gro.objList[0];

          if (this.map)
            if (this.company.lat != null)
            {
              let gmap = this.map.getMap();
              gmap.setOptions({
                center: { lat: this.company.lat, lng: this.company.lng },
                zoom: 18
              });
              this.gMapOverlays = [new google.maps.Marker({ position: { lat: this.company.lat, lng: this.company.lng }, draggable: false })];
            }
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company', ''));
  }
  loadCompanyWorkingHours()
  {
    this.companyService.getCompanyWorkingHours(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
        this.companyWorkingHours = gro.objList[0];
    });
  }
  getWorkingHoursString(rawWH: string)
  {
    let whString: string = "";

    let aux = rawWH.substring(1, rawWH.length - 1);

    let re = /,/g;
    whString = aux.replace(re, ' - ');
    return whString;
  }

  loadCompanyImages()
  {
    this.imageService.getCompanyImages(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.images = <Image[]>gro.objList;
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company images', ''));
  }
  onImageClick(image: Image)
  {
    this.selectedImage = image;
    this.displayImageDialog = true;
  }

}
