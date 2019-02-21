import { GrowlModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRegistrationComponent } from './user-registration.component';
import { RouterModule } from '@angular/router';
import {InputTextModule,
    ButtonModule} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    ReactiveFormsModule,
    GrowlModule
  ],
  declarations: [
    UserRegistrationComponent
  ],
  providers:[]
})
export class UserRegistrationModule { }
