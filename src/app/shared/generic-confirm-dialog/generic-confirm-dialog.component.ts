import { Component, OnInit, Injector, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../base-component';
import { RecaptchaService } from '../../app-services/recaptcha.service';
import { Actions } from 'app/enums/enums';

@Component({
  selector: 'bf-generic-confirm-dialog',
  templateUrl: './generic-confirm-dialog.component.html',
  styleUrls: ['./generic-confirm-dialog.component.css']
})
export class GenericConfirmDialogComponent extends BaseComponent implements OnInit, OnChanges
{
  
  @Input() confirmMessage: string = "Are you sure?";
  @Input() useCaptcha: boolean = false;
  @Input() resetCaptcha: boolean = false;
  @Output() onConfirm = new EventEmitter<string>();

  validCaptcha: boolean = false;

  constructor(private injector: Injector,
  private recaptchaService:RecaptchaService)
  {
    super(injector,
      ['lblYes',
        'lblNo']);
  }

  ngOnInit() 
  {
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes['resetCaptcha'])
      this.validCaptcha = false;
  }

  onResolvedCaptcha(captchaResponse: string)
  {
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaService.checkCaptchaResponse(captchaResponse).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Save, gro.error, gro.errorDetailed, true);
      else
        this.validCaptcha = JSON.parse(gro.objList[0]).success;
    });
  }

  onConfirmClick()
  {
    this.onConfirm.emit('yes');
  }
  onCancelClick()
  {
    this.onConfirm.emit('no');
  }

}
