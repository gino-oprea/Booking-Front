import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchCompanyComponent } from './search-company.component';
import { GrowlModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GrowlModule
  ],
  declarations: [
    SearchCompanyComponent
  ]
})
export class SearchCompanyModule { }
