import { Injectable } from '@angular/core';
import
{
  ActivatedRouteSnapshot, CanActivate,
  //CanActivateChild,
  Router, RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../app-services/login.service';

@Injectable()
export class AuthGuard implements CanActivate//,CanActivateChild
{
  
  constructor(private loginService: LoginService, private router: Router)
  {

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    if (this.loginService.isAuthenticated())
      return true;
    else
      this.router.navigate(['/searchcompany']);  
  }

  // public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  // {
  //   if (this.userService.isAuthenticated())
  //     return true;
  //   else
  //     this.router.navigate(['../searchcompany']); 
  // }
  
}  
