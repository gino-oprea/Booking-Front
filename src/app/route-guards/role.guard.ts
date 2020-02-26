import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../app-services/login.service';
import { Observable } from 'rxjs';
import { UserRoleEnum } from '../enums/enums';
import { COMPANY_ROUTES } from 'app/back/company.routing';

@Injectable()
export class RoleGuard implements CanActivate
{
  backOfficeRoutesWithModule: any[];

  constructor(private loginService: LoginService,
    private router: Router)
  {     
    
  }

  getFirstRouteWithModuleRights(idCompany:number):string
  {
    let resultRoute: string = '';
    for (let i = 0; i < COMPANY_ROUTES[0].children.length; i++) 
    {
      if (COMPANY_ROUTES[0].children[i].path != '')
      {
        let route = COMPANY_ROUTES[0].children[i];
        let requiredModule = route.data.module;
        let currentUser = this.loginService.getCurrentUser();
        let role = currentUser.rolesWithModules.find(r => r.idCompany == idCompany);
        if (role != null && role.siteModules.find(m => m.name == requiredModule) != null)
        {
          resultRoute = route.path;
          break;
        }
      }
    }
       
    return resultRoute;
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    //return true;//de scos dupa modificari    

    let requiredModule = route.data.module as string;
    let idCompany = route.parent.params["id"];
    let currentUser = this.loginService.getCurrentUser();
    let role = currentUser.rolesWithModules.find(r => r.idCompany == idCompany);
    if (role)
    {
      if (role.siteModules.find(m => m.name == requiredModule))
        return true;
      else
      {
        //de gandit o solutie de routare la primul modul pe care are permisiuni
        let path = this.getFirstRouteWithModuleRights(idCompany);
        if (path != '')
          this.router.navigate(["/company/" + idCompany + "/" +path]);          
        else
          this.router.navigate(['/searchcompany']);
      }
    }
    else
      this.router.navigate(['/searchcompany']);
  }
}