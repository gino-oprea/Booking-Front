import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import {InputTextModule,
  ButtonModule,
GrowlModule} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    GrowlModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent
  ],
  providers:[]
})
export class LoginModule { }
