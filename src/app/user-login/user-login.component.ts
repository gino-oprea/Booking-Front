import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Token } from 'app/objects/token';
import { GenericResponseObject } from '../objects/generic-response-object';

@Component({
  selector: 'bf-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent extends BaseComponent implements OnInit
{
  myForm: FormGroup;

  displayDialog: boolean = false;

  constructor(private injector: Injector)
  {
    super(injector, [
      'lblChangePassword',
      'lblConfirmation',
      'lblConfirmForgotPassword',
      'lblResetPasswordEmailSent',
      'lblForgotPassword',
      'lblRegister',
      'lblYes',
      'lblNo'
    ]);
    this.site = WebSites.Front;
    this.pageName = "User login";
  }

  ngOnInit() 
  {
    super.ngOnInit();

    this.myForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });

  }

  onSubmit()
  {
    this.loginService.login(this.myForm.controls['email'].value,
      this.myForm.controls['password'].value, this).subscribe((token: Token) =>
      {
        if (token)
        {
          this.logAction(null, false, Actions.Login, "", "Login user " + this.myForm.controls['email'].value);
          this.router.navigate(['/searchcompany']);
        }
        else
          this.logAction(null, true, Actions.Login, 'Invalid login', '', true);
      },
        err =>
        {
          this.logAction(null, true, Actions.Login, "invalid login", 'invalid login', true);
        });
  }

  onForgotPassword()
  {
    this.displayDialog = false;
    try
    {
      this.usersService.resetUserPasswordByEmail(this.myForm.controls['email'].value)
        .subscribe((response: GenericResponseObject) =>
        {
          if (response.info.indexOf('success') > -1)
          {
            this.showPageMessage("success", "Success", this.getCurrentLabelValue('lblResetPasswordEmailSent'));
            this.logAction(null, false, Actions.Edit, "", "password reset");
          }
          else
          {
            this.showPageMessage("error", "Error", response.error);
            this.logAction(null, true, Actions.Edit, response.error, "error forgot password: " + response.errorDetailed);
          }
        },
          err => this.logAction(null, true, Actions.Edit, "http error resetting password", ""));
    }
    catch (e)
    {
      this.logAction(null, true, Actions.Edit, e.message, "error reset password");
    }
  }

  displayConfirmDialog()
  {
    if (this.myForm.controls['email'].valid)
      this.displayDialog = true;
    else
      this.showPageMessage("warn", "Warning", this.getCurrentLabelValue('lblInvalidEmail'));
  }

}
