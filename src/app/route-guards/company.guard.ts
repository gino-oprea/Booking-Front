import { UsersService } from '../app-services/users.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyService } from '../app-services/company.service';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';

@Injectable()
export class CompanyGuard implements CanActivate
{
  constructor(private companyService: CompanyService, private usersService: UsersService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    ////se verifica daca userul logat este proprietarul companiei din ruta
    let companyId = route.params["id"];

    return this.companyService.getCompanies(this.usersService.getCurrentUser().id).pipe(map(result =>
    {
      let gro = <GenericResponseObject>result;
      let hasCompany = false;

      for (var i = 0; i < gro.objList.length; i++) 
      {
        let company = <Company>gro.objList[i];
        if (company.id.toString() == companyId)
        {
          hasCompany = true;
          break;
        }
      }
      if (hasCompany)
        return hasCompany;
      else
        this.router.navigate(['/mycompanies']);
    }));
  }
}