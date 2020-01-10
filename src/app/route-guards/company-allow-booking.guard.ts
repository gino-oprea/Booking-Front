import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyFilter } from '../objects/company-filter';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';
import { CompanySearchService } from '../app-services/company-search.service';

@Injectable()
export class CompanyAllowBookingGuard implements CanActivate
{
  constructor(private companyService: CompanySearchService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    ////se verifica daca compania din ruta chiar exista in baza de date si permite bookinguri online
    let companyId = route.params["id"];
    let companyName = route.params["companyname"];

    let flt = new CompanyFilter(companyId, null, null, null, null, null);

    return this.companyService.getCompanies(flt).pipe(map(result =>
    {
      let gro = <GenericResponseObject>result;

      if (gro.objList.length > 0)
      {
        let company = <Company>gro.objList[0];
        if (company.id == companyId && companyName == company.name.replace(/ /g, '') && company.allowOnlineBookings)
          return true;
        else
          this.router.navigate(['/searchcompany']);
      }
      else
        this.router.navigate(['/searchcompany']);
    }));
  }
}