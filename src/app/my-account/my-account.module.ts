import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAccountComponent } from './my-account.component';
import { ChangePasswordComponent } from './change-password.component';
import {InputTextModule,
  ButtonModule,
GrowlModule} from 'primeng/primeng';


@NgModule({
  imports: [    
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,    
    GrowlModule,
    ReactiveFormsModule
  ],
  declarations: [
    MyAccountComponent,
    ChangePasswordComponent
  ],
  providers:[]
})
export class MyAccountModule { }
