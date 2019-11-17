import { Actions, WebSites } from '../enums/enums';
import { Message } from 'primeng/primeng';
import { UsersService } from '../app-services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../objects/user';
import { GenericResponseObject } from '../objects/generic-response-object';
import { BaseComponent } from '../shared/base-component';

@Component({
  selector: 'bf-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent extends BaseComponent implements OnInit
{
  emailExists: boolean = false;
  passwordsMatch: boolean = false;
  myForm: FormGroup;
  pageMsgs: Message[] = [];

  constructor(private injector:Injector) 
  {
    super(injector,
      [
        'lblRegister',
        'lblFirstName',
        'lblLastName',
        'lblPhone',
        'lblPassword',
        'lblConfirmPassword',
        'lblRequired',
        'lblInvalidEmail',
        'lblEmailAlreadyExists',
        'lblPasswordsDontMatch',
        'lblRegisterNow',
        'lblHttpError',
        'lblActivationLinkSent'
      ]
    );
    this.site = WebSites.Front;
    this.pageName = "User registration";

    this.myForm = new FormGroup({
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")],
        this.emailExistsValidator.bind(this)),
      'phone': new FormControl('', Validators.required),
      'passwords': new FormGroup({
        'password': new FormControl('', Validators.required),
        'confirmpassword': new FormControl('', Validators.required)
      }, this.confirmPasswordValidator.bind(this))
    });
  }

  ngOnInit()
  {
    this.logAction(null, false, Actions.View, "", "");
  }

  onSubmit()
  {
    try {
      //console.log(this.myForm);
      let user = new User();
      user.email = this.myForm.controls['email'].value;
      user.firstName = this.myForm.controls['firstname'].value;
      user.lastName = this.myForm.controls['lastname'].value;
      user.idRole = 2;
      user.isEnabled = false;
      user.phone = this.myForm.controls['phone'].value;
      user.password = (<FormGroup>this.myForm.controls['passwords']).controls['password'].value;

      console.log(user);
      this.usersService.registerUser(user).subscribe((response: GenericResponseObject) =>
      {
        console.log(response);
        let gro = response;
        if (gro.info.indexOf('success') > -1) {
          this.showPageMessage("success","Success", this.getCurrentLabelValue('lblActivationLinkSent'));
          this.myForm.reset();

          this.logAction(null, false, Actions.Add, "", "");
          //alert('success')
        }
        else
        {
          this.showPageMessage("error", "Error", gro.error);
          this.logAction(null, true, Actions.Add, gro.error, gro.errorDetailed);
        }
      },
        err =>
        {
          console.log(err);
          this.showPageMessage("error", "Error", this.getCurrentLabelValue('lblHttpError'));
          this.logAction(null, true, Actions.Add, "http error on register user", "");
        });
    }
    catch (e)
    {
      this.logAction(null, true, Actions.Add, e.message, "");
    }
  }

  confirmPasswordValidator(group: FormGroup): { [s: string]: boolean }
  {
    if (group.controls['password'].value === group.controls['confirmpassword'].value) {
      this.passwordsMatch = true;
      return null;
    }
    else {
      this.passwordsMatch = false;
      return { pass: true };
    }
  }

  emailExistsValidator(control: FormControl): Promise<any> | Observable<any>
  {
    const promise = new Promise<any>(
      (resolve, reject) =>
      {
        this.usersService.getUserByEmailForUserRegistration(control.value).subscribe((data: User) =>
        {
          if (data.error === 'User does not exist') {
            this.emailExists = false;
            resolve(null);
          }
          else {
            this.emailExists = true;
            resolve({ 'invalid': true });
          }
        },
          err => console.log(err),
        );
      }
    );
    return promise;
  }
  
  
}
