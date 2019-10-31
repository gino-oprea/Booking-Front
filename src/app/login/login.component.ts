import { Router } from '@angular/router';
import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../app-services/users.service';
import { User } from '../objects/user';
import { GenericResponseObject } from '../objects/generic-response-object';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'bf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit 
{
  myForm: FormGroup;

  constructor(private injector: Injector)
  {
    super(injector,
      [
        'lblPassword',
        'lblRegister',
        'lblForgotPassword',
        'lblHttpError'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "Login";

    this.myForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  ngOnInit() 
  {
    this.logAction(null, false, Actions.View, "", "");
  }
  onLogin()
  {
    this.loginService.login(
      this.myForm.controls['email'].value,
      this.myForm.controls['password'].value).subscribe(token =>
      {
        var decoded = jwt_decode(token.access_token);
        var username: string = decoded.sub;
        this.usersService.getUserByEmail(username).subscribe(result =>
        {

          console.log(result);
          if (result.error == '')//
          {
            this.logAction(null, false, Actions.Login, "", "");

            this.usersService.editUser(result, 1).subscribe((data) =>
            {
              let gro = (<GenericResponseObject>JSON.parse(data._body));
              console.log(gro);
              if (gro.info.indexOf('success') > -1)
              {
                this.router.navigate(['/searchcompany']);
                this.loginService.emmitLoginChange();
              }
              else
              {
                console.log(gro.error);
                this.logAction(null, true, Actions.Login, gro.error, gro.errorDetailed);
              }
            },
              err =>
              {
                console.log(err)
                this.logAction(null, true, Actions.Login, "http error", "");
              });

          }
          else
          {
            console.log(result.error);
            this.showPageMessage("error", "Error", result.error);
            this.logAction(null, true, Actions.Login, result.error, result.errorDetailed);
          }
        },
          err =>
          {
            console.log(err);
            this.showPageMessage("error", "Error", this.getCurrentLabelValue('lblHttpError'));
            this.logAction(null, true, Actions.Login, "http request error", "");
          });
      },
        err =>
        {
          console.log(err);
          this.showPageMessage("error", "Error", this.getCurrentLabelValue('lblHttpError'));
          this.logAction(null, true, Actions.Login, "http request error", "");
        });
  }

}
