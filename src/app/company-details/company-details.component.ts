import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';

@Component({
  selector: 'bf-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent extends BaseComponent implements OnInit
{

  companyName: string = '';

  constructor(private injector: Injector)
  {
    super(injector,
      ['lblTest']
    );
    this.site = WebSites.Front;
    this.pageName = "Company Details";

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
    this.logAction(null, false, Actions.View, "", "");
  }

  goToBooking(companyId: number, companyName: string)
  {
    this.router.navigate(['/companybooking', companyId, companyName.replace(/ /g, '')]);
  }

}
