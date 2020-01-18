import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';

@Component({
  selector: 'bf-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.css']
})
export class GdprComponent extends BaseComponent implements OnInit
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
