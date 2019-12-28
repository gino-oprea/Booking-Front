import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../objects/user';
import { GenericResponseObject } from '../objects/generic-response-object';

@Component({
  selector: 'bf-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent extends BaseComponent implements OnInit 
{

  userForm: FormGroup;
  user: User; 
  constructor(private injector: Injector)
  {
    super(injector, [
      'lblFirstName',
      'lblLastName',
      'lblPhone',
      'lblSave',
      'lblMyAccount',
      'lblSaved'
    ]);
    this.site = WebSites.Front;
    this.pageName = "My account";

   }

  ngOnInit() 
  {
    this.logAction(null, false, Actions.View, "", "");

   this.user = this.loginService.getCurrentUser();
    
    this.initForm();  
  }

  initForm()
  {
    
    this.userForm = new FormGroup({
      'firstName': new FormControl(this.user!=null? this.user.firstName:'', Validators.required),
      'lastName': new FormControl(this.user!=null? this.user.lastName:'', Validators.required),
      'phone': new FormControl(this.user!=null? this.user.phone:'', Validators.required),
      'email': new FormControl(this.user!=null? this.user.email:'', [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")])      
    });
  }
  onSave()
  {
    try
    {      
        this.user.lastName = this.userForm.controls['lastName'].value;
        this.user.firstName = this.userForm.controls['firstName'].value;
        this.user.phone = this.userForm.controls['phone'].value;
        this.user.email = this.userForm.controls['email'].value;
        this.user.password = '';
        
        //update mode 2 -update tot
        this.usersService.editUser(this.user, null, 2).subscribe((response: any) =>
        {
          console.log(response);
          let gro = <GenericResponseObject>JSON.parse(response._body);
          if (gro.info.indexOf('success') > -1)
          {
            localStorage.setItem('b_front_auth_user', JSON.stringify(this.user));
            this.loginService.emmitLoginChange();

            this.showPageMessage("success", "Success", this.getCurrentLabelValue('lblSaved'));
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

}
