import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../shared/base-component';
import { WebSites, Actions } from '../enums/enums';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../objects/user';
import { ContactService } from '../app-services/contact.service';
import { ContactForm } from 'app/objects/contact-form';
import { RecaptchaService } from '../app-services/recaptcha.service';

@Component({
  selector: 'bf-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent extends BaseComponent implements OnInit 
{
  contactForm: FormGroup;
  user: User;  
  agree: boolean = false;

  validCaptcha: boolean = false;

  constructor(private injector: Injector,
    private contactService: ContactService,
    private recaptchaService: RecaptchaService)
  {
    super(injector, [
      'lblIHaveRead',
      'lblPrivacyPolicy',
      'lblAndIAgree',
      'lblFirstName',
      'lblLastName',
      'lblEmail',
      'lblPhone',
      'lblSubject',
      'lblMessage',
      'lblSubmit',
      'lblRequest',
      'lblComplaint',
      'lblSuggestion',
      'lblOther',
      'lblBug',
      'lblMessageSent'
    ]);
    this.site = WebSites.Front;
    this.pageName = "Contact";
  }

  ngOnInit() 
  {
    super.ngOnInit();
    this.user = this.loginService.getCurrentUser();
    this.initForm();
  }
  initForm()
  {
    this.contactForm = new FormGroup({
      'firstName': new FormControl(this.user != null ? this.user.firstName : '', Validators.required),
      'lastName': new FormControl(this.user != null ? this.user.lastName : '', Validators.required),
      'phone': new FormControl(this.user != null ? this.user.phone : '', Validators.required),
      'email': new FormControl(this.user != null ? this.user.email : '', [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),

      'subject': new FormControl('Feedback', Validators.required),
      'message': new FormControl('', Validators.required),
      'agree': new FormControl(false)
    });
  }

  getContactFromForm(): ContactForm
  {
    let contact: ContactForm = {
      firstName: this.contactForm.controls['firstName'].value,
      lastName: this.contactForm.controls['lastName'].value,
      phone: this.contactForm.controls['phone'].value,
      email: this.contactForm.controls['email'].value,
      subject: this.contactForm.controls['subject'].value,
      message: this.contactForm.controls['message'].value,
    };

    return contact
  }
  isUserAgree()
  {
    this.agree = this.contactForm.controls['agree'].value;
  }

  onSubmit()
  {
    this.contactService.submitContactForm(this.getContactFromForm()).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(null, true, Actions.Add, gro.error, gro.errorDetailed, true);
      else
        this.logAction(null, false, Actions.Add, '', 'Message sent', true, this.getCurrentLabelValue('lblMessageSent'));
    });
  }

  onResolvedCaptcha(captchaResponse: string)
  {
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaService.checkCaptchaResponse(captchaResponse).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
      else
        this.validCaptcha = JSON.parse(gro.objList[0]).success;
    });
  }

}
