import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, Injector } from '@angular/core';
import { UsersService } from '../app-services/users.service';
import { User } from '../objects/user';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';

@Component({
  selector: 'bf-user-activation',
  templateUrl: './user-activation.component.html',
  styles: []
})
export class UserActivationComponent extends BaseComponent implements OnInit, OnDestroy
{
  title: string = 'activating user...';
  subscription: Subscription;
  activationKey: string;

  constructor(private injector: Injector)
  {
    super(injector,
      [
        'lblActivatingUser',
        'lblUserActivated',
        'lblUserCouldNotBeActivated'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "User activation";
    this.title = this.getCurrentLabelValue('lblActivatingUser');
  }

  ngOnInit()
  {
    super.ngOnInit();

    this.subscription = this.route.params.subscribe(
      (params: any) =>
      {
        this.activationKey = params['activationKey'];
        try
        {
          this.usersService.activateUser(this.activationKey).subscribe((result: User) =>
          {
            if (result.error == '')
            {
              // this.title = this.getCurrentLabelValue('lblUserActivated');
              // this.logAction(null, false, Actions.Edit, "", "user " + result.email + " activated");
              // console.log(result);//aici se va face login si redirect catre prima pagina cu autentificare

              // localStorage.setItem('b_front_auth_user', JSON.stringify(result));
              // this.loginService.loggedIn = true;
              // this.loginService.emmitLoginChange();
              this.logAction(this.idCompany, false, Actions.Edit, '', 'User activation ' + result.email);
              this.router.navigate(['/login']);
            }
            else
            {
              this.logAction(null, true, Actions.Edit, result.error, result.errorDetailed);
              this.title = this.getCurrentLabelValue('lblUserCouldNotBeActivated');
              console.log(result);
            }
          });
        }
        catch (e)
        {
          this.logAction(null, true, Actions.Edit, e.message, "");
          console.log(e.message);
        }
      },
      err =>
      {
        this.logAction(null, true, Actions.Edit, "http error while getting route activation key", "");
        console.log(err);
      }
    );

  }

  ngOnDestroy(): void 
  {
    this.subscription.unsubscribe();
  }

}
