import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../app-services/login.service';
import { Observable } from 'rxjs';
import { UserRoleEnum } from '../enums/enums';

@Injectable()
export class RoleGuard implements CanActivate
{
  constructor(private loginService: LoginService,
    private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    //return true;

    let requiredRole = route.data.role as string;
    let idCompany = route.parent.params["id"];
    let currentUser = this.loginService.getCurrentUser();
    let role = currentUser.roles.find(r => r.idCompany == idCompany);
    if (role)
    {
      if (role.idRole <= UserRoleEnum[requiredRole])
        return true;
      else
        if (role.idRole == UserRoleEnum.Employee)
          this.router.navigate(["/company/" + idCompany + "/bookings"]);
        else
          this.router.navigate(['/searchcompany']);
    }
    else
      this.router.navigate(['/searchcompany']);
  }
}