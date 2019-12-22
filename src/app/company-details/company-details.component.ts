import { Component, OnInit, Injector, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { basename } from 'path';
import { CompanyService } from '../app-services/company.service';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';
import { Image } from '../objects/image';
import { ImageService } from '../app-services/image.service';

@Component({
  selector: 'bf-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent extends BaseComponent implements OnInit
{
  
  @ViewChild('map', { static: false }) map;
 
  public COMP_IMG = require("../img/company.jpg");

  companyName: string = '';
  company: Company;
  images: Image[] = [];
  selectedImage: Image = null;
  displayImageDialog = false;

  mapOptions = {
    center: { lat: 45.951249, lng: 24.793491 },
    zoom: 5
  };
  gMapOverlays: any[] = [];

  

  constructor(private injector: Injector,
    private companyService: CompanyService,
    private imageService: ImageService)
  {
    super(injector,
      [ 'lblName',
        'lblDescription',
        'lblCategory',
        'lblSubCategory',
        'lblCountry',
        'lblTown',
        'lblAddress',
        'lblPhone']
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
  }

  ngOnInit() 
  {
    super.ngOnInit();    
    this.loadCompany();
    this.loadCompanyImages();    
  }
 

  goToBooking(companyId: number, companyName: string)
  {
    this.router.navigate(['/companybooking', companyId, companyName.replace(/ /g, '')]);
  }

  loadCompany()
  {
    this.companyService.getCompany(this.loginService.getCurrentUser().id, this.idCompany).subscribe(result =>
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
