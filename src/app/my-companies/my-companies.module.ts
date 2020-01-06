import
{  
  DataGridModule,
  ButtonModule,
  DialogModule,
  GrowlModule,
  InputSwitchModule
} from 'primeng/primeng';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCompaniesComponent } from './my-companies.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataGridModule,
    SharedModule,
    ButtonModule,
    DialogModule,
    GrowlModule,
    InputSwitchModule
  ],
  declarations: [
    MyCompaniesComponent
  ]
})
export class MyCompaniesModule { }
