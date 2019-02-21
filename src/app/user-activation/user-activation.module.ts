import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserActivationComponent } from './user-activation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule    
  ],
  declarations: [
    UserActivationComponent
  ],
  providers:[]
})
export class UserActivationModule { }
