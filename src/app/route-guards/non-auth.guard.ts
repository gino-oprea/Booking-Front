import { UsersService } from '../app-services/users.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NonAuthGuard implements CanActivate
{
  constructor(private userService:UsersService, private router:Router)
  {

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean   
  {
    if (this.userService.isAuthenticated())
      this.router.navigate(['/searchcompany']);  
    else
      return true;  
  }
}