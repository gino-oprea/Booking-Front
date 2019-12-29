import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions, UserRoleEnum } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'app/objects/user';
import { UsersService } from '../../app-services/users.service';
import { SelectItem } from 'primeng/primeng';
import { UserRole } from '../../objects/user-role';

@Component({
  selector: 'bf-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.css']
})
export class CompanyUsersComponent extends BaseComponent implements OnInit
{
  userForm: FormGroup;
  users: User[] = [];
  selectedUser: User;
  roles: UserRole[];


  constructor(private injector: Injector)
  {
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "CompanyUsers";

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
  }

  ngOnInit() 
  {
    super.ngOnInit();
    this.initRoles();
    this.initForm();
    this.loadUsers();
  }
  initRoles()
  {
    this.roles = [];
    this.roles.push(new UserRole(UserRoleEnum.CompanyOwner, 'CompanyOwner'));
    this.roles.push(new UserRole(UserRoleEnum.Employee, 'Employee'));
  }
  initForm()
  {
    this.userForm = new FormGroup({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'phone': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'role': new FormControl(UserRoleEnum.CompanyOwner)
    });
  }
  loadUsers()
  {
    this.usersService.getCompanyUsers(this.idCompany).subscribe(gro =>
    {
      if (gro.error != "")
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.users = <User[]>gro.objList;
      }
    });
  }
  onRowSelect(event)
  {
    this.setSelectedUserOnForm();
  }
  setSelectedUserOnForm()
  {
    this.userForm.controls["firstName"].setValue(this.selectedUser.firstName);
    this.userForm.controls["lastName"].setValue(this.selectedUser.lastName);
    this.userForm.controls["phone"].setValue(this.selectedUser.phone);
    this.userForm.controls["email"].setValue(this.selectedUser.email);
    this.userForm.controls["role"].setValue(this.selectedUser.roles[0].idRole);
  }
  onSave()
  {

  }
}
