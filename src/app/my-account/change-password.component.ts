import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../objects/user';
import { GenericResponseObject } from '../objects/generic-response-object';

@Component({
  selector: 'bf-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent extends BaseComponent implements OnInit
{

  passwordsMatch: boolean = false;
  incorrectPassword: boolean = true;
  user: User;

  passwordForm: FormGroup;
  constructor(private injector: Injector)
  {
    super(injector,
      [
        'lblChangePassword',
        'lblCurrentPassword',
        'lblNewPassword',
        'lblConfirmNewPassword',
        'lblYourPasswordChanged',
        'lblSave'
      ]);
    this.site = WebSites.Front;
    this.pageName = "Change password";
  }

  ngOnInit()
  {
    this.logAction(null, false, Actions.View, "", "");
    this.user = this.usersService.getCurrentUser();
    this.initForm();
  }
  initForm()
  {
    this.passwordForm = new FormGroup({
      'currentPassword': new FormControl('', Validators.required, this.currentPasswordValidator.bind(this)),
      'newPassword': new FormControl('', Validators.required),
      'confirmNewPassword': new FormControl('', Validators.required)
    }, this.confirmPasswordValidator.bind(this));
  }
  onSave()
  {
    try
    {
      this.user.password = this.passwordForm.controls['newPassword'].value;;

      //update mode 3 -update doar parola
      this.usersService.editUser(this.user, 3).subscribe((response: any) =>
      {
        console.log(response);
        let gro = <GenericResponseObject>response;
        if (gro.info.indexOf('success') > -1)
        {
          localStorage.setItem('b_front_auth_user', JSON.stringify(this.user));
          this.usersService.emmitLoginChange();

          this.showPageMessage("success", "Success", this.getCurrentLabelValue('lblYourPasswordChanged'));
          this.logAction(null, false, Actions.Edit, "", "");
        }
        else
        {
          this.showPageMessage("error", "Error", gro.error);
          this.logAction(null, true, Actions.Edit, gro.error, gro.errorDetailed);
        }
      },
        err =>
        {
          console.log(err);
          this.logAction(null, true, Actions.Edit, "http error on edit user", "");
        });
    }
    catch (e)
    {
      this.logAction(null, true, Actions.Save, e.message, "");
    }

  }

  confirmPasswordValidator(group: FormGroup): { [s: string]: boolean }
  {
    if (group.controls['newPassword'].value === group.controls['confirmNewPassword'].value)
    {
      this.passwordsMatch = true;
      return null;
    }
    else
    {
      this.passwordsMatch = false;
      return { pass: true };
    }
  }

  currentPasswordValidator(control: FormControl): Promise<any> | Observable<any>
  {
    const promise = new Promise<any>(
      (resolve, reject) =>
      {
        this.usersService.checkPassword(this.user.id, control.value).subscribe((data: GenericResponseObject) =>
        {
          if (data.error != '')
          {
            this.incorrectPassword = true;
            resolve({ 'invalid': true });
          }
          else
          {
            this.incorrectPassword = false;
            resolve(null);
          }
        },
          err => console.log(err),
        );
      }
    );
    return promise;
  }

}
