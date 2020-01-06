import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Token } from 'app/objects/token';

@Component({
  selector: 'bf-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent extends BaseComponent implements OnInit
{
  myForm: FormGroup;

  constructor(private injector: Injector)
  {
    super(injector, []);
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
          this.router.navigate(['/searchcompany']);
        else
          this.logAction(null, true, Actions.Login, 'Invalid login', '', true);
      },
        err =>
        {
          this.logAction(null, true, Actions.Login, "invalid login", 'invalid login', true);
        });
  }

}
