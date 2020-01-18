import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';

@Component({
  selector: 'bf-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent extends BaseComponent implements OnInit
{

  constructor(private injector: Injector)
  {
    super(injector, []);
  }

  ngOnInit()
  {
    super.ngOnInit();
  }

}
