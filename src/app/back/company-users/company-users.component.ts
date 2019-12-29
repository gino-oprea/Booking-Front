import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions, UserRoleEnum, LevelType } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'app/objects/user';
import { UsersService } from '../../app-services/users.service';
import { SelectItem } from 'primeng/primeng';
import { UserRole } from '../../objects/user-role';
import { Entity } from '../../objects/entity';

import { Company } from '../../objects/company';
import { LevelsService } from '../../app-services/levels.service';
import { Level } from '../../objects/level';
import { EntitiesService } from '../../app-services/entities.service';

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
  entities: Entity[];
  showLinkedEntities: boolean = true;
  isAdd: boolean = true;


  constructor(private injector: Injector,
    private levelsService: LevelsService,
  private entitiesService:EntitiesService)
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
    this.loadCompanyEmployees();
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
      'role': new FormControl(UserRoleEnum.Employee),
      'entity': new FormControl('0')
    });

    this.showLinkedEntities = (this.userForm.controls["role"].value == UserRoleEnum.Employee);
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
  loadCompanyEmployees()
  {
    this.levelsService.getLevels(this.idCompany).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        let levels = <Level[]>gro.objList;
        let employeeLevel = levels.find(l => l.idLevelType == LevelType.Employee);
        if (employeeLevel)
        {
          this.entitiesService.getEntities(employeeLevel.id, null).subscribe(groEntities =>
          {
            if (groEntities.error != '')
              this.logAction(this.idCompany, true, Actions.Search, groEntities.error, groEntities.errorDetailed, true);
            else
            {
              this.entities = <Entity[]>groEntities.objList;
            }
          });
        }
      }
    });
  }
  onRowSelect(event)
  {
    this.setSelectedUserOnForm();
  }
  setSelectedUserOnForm()
  {
    this.isAdd = false;

    this.userForm.controls["firstName"].setValue(this.selectedUser.firstName);
    this.userForm.controls["lastName"].setValue(this.selectedUser.lastName);
    this.userForm.controls["phone"].setValue(this.selectedUser.phone);
    this.userForm.controls["email"].setValue(this.selectedUser.email);
    this.userForm.controls["role"].setValue(this.selectedUser.roles[0].idRole);

    this.showLinkedEntities = (this.userForm.controls["role"].value == UserRoleEnum.Employee);
    //de pus si entitatea la care e legat
  }
  onChangeRole(event)
  {
    let idRole = event.target.value;
    if (idRole == UserRoleEnum.Employee)
      this.showLinkedEntities = true;
    else
      this.showLinkedEntities = false;
  }
  onAdd()
  {
    this.isAdd = true;
    this.initForm();
    this.selectedUser = null;
  }
  onSave()
  {

  }
  onDelete()
  {
    
  }
  onResetPassword()
  {
    
  }
}
