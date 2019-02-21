import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'app/shared/base-component';
import { WebSites } from './enums/enums';

@Component({
  selector: 'bf-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends BaseComponent
{
  title = 'bf works!';

  constructor(private injector: Injector)
    {
      super(injector, []);
      this.site = WebSites.Front;
      this.pageName = "Booking Front main parent page";      
    }
}
