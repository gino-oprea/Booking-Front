import { Component, OnInit, Injector, OnChanges, Input } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions, UserRoleEnum, LevelType } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'app/objects/user';
import { UserRole } from '../../objects/user-role';
import { Entity } from '../../objects/entity';
import { Company } from '../../objects/company';
import { LevelsService } from '../../app-services/levels.service';
import { Level } from '../../objects/level';
import { EntitiesService } from '../../app-services/entities.service';
import { CompanyUsersService } from '../../app-services/company-users.service';
import { CompanyUser } from '../../objects/user';
import { RolesService } from '../../app-services/roles.service';

@Component({
  selector: 'bf-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.css']
})
export class CompanyUsersComponent extends BaseComponent implements OnInit, OnChanges
{
  @Input() doReloadRoles: boolean = false;
 
  userForm: FormGroup;
  users: CompanyUser[] = [];
  selectedUser: CompanyUser;
  roles: UserRole[];
  entities: Entity[];
  //showLinkedEntities: boolean = true;
  isAdd: boolean = true;


  constructor(private injector: Injector,
    private levelsService: LevelsService,
    private entitiesService: EntitiesService,
    private companyUsersService: CompanyUsersService,
    private rolesService: RolesService)
  {
    super(injector, [
      'lblUsers',
      'lblEmail',
      'lblPhone',
      'lblName',
      'lblRole',
      'lblCreationDate',
      'lblLastLogin',
      'lblFirstName',
      'lblLastName',
      'lblLinkedTo',
      'lblAdd',
      'lblSave',
      'lblDelete',
      'lblAddedUser',
      'lblEditedUser',
      'lblDeletedUser'
    ]);

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

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void
  {
    if (changes['doReloadRoles'])
    {
      this.loadRoles();
    }
  }

  ngOnInit() 
  {
    super.ngOnInit();
    this.initForm();      
    this.loadRoles();
    this.loadCompanyEmployees();
  }
  loadRoles()
  {
    this.rolesService.getRoles(this.idCompany).subscribe(gro =>
    {      
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.roles = <UserRole[]>gro.objList;  
        this.loadUsers();
      }
    });
  }
  initForm()
  {
    this.userForm = new FormGroup({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'phone': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'role': new FormControl(this.roles ? this.roles[0].idRole : '0'),
      'entity': new FormControl('0')
    });

    //this.showLinkedEntities = (this.userForm.controls["role"].value == UserRoleEnum.Employee);
  }
  loadUsers(idSelectedUser: number = null)
  {
    this.companyUsersService.getCompanyUsers(this.idCompany).subscribe(gro =>
    {
      if (gro.error != "")
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.users = <CompanyUser[]>gro.objList;
        if (idSelectedUser)
          this.selectedUser = this.users.find(u => u.id == idSelectedUser);
        else
          if (this.users.length > 0)
            this.selectedUser = this.users[0];

        this.setSelectedUserOnForm();
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
    this.userForm.controls["role"].setValue(this.selectedUser.roles.find(r => r.idCompany == this.idCompany).idRole);

    //this.showLinkedEntities = (this.userForm.controls["role"].value == UserRoleEnum.Employee);
    this.userForm.controls['entity'].setValue(this.selectedUser.linkedIdEntity != null ? this.selectedUser.linkedIdEntity : '0');
  }
  getUserFromForm(): CompanyUser
  {
    let companyUser = new CompanyUser();
    if (this.selectedUser)
    {
      companyUser.id = this.selectedUser.id;
    }

    companyUser.firstName = this.userForm.controls['firstName'].value;
    companyUser.lastName = this.userForm.controls['lastName'].value;
    companyUser.phone = this.userForm.controls['phone'].value;
    companyUser.email = this.userForm.controls['email'].value;
    let role = new UserRole(parseInt(this.userForm.controls['role'].value), null, this.idCompany);
    companyUser.roles = [role];
    companyUser.linkedIdEntity = parseInt(this.userForm.controls['entity'].value) != 0 ? parseInt(this.userForm.controls['entity'].value) : null;

    return companyUser;
  }
  // onChangeRole(event)
  // {
  //   let idRole = event.target.value;
  //   if (idRole == UserRoleEnum.Employee)
  //     this.showLinkedEntities = true;
  //   else
  //   {
  //     this.showLinkedEntities = false;
  //     this.userForm.controls['entity'].setValue(0);
  //   }
  // }
  onAdd()
  {
    this.isAdd = true;
    this.initForm();
    this.selectedUser = null;
  }
  onSave()
  {
    let companyUser = this.getUserFromForm();

    if (this.isAdd)//add
    {
      this.companyUsersService.addCompanyUser(companyUser, this.idCompany).subscribe(gro =>
      {
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);
          this.loadUsers();
        }
        else
        {
          this.logAction(this.idCompany, false, Actions.Add, '', this.getCurrentLabelValue('lblAddedUser')+' ' + companyUser.email, true);
          var idUser = <number>gro.objList[0];
          this.loadUsers(idUser);
        }
      });
    }
    else//edit
    {
      this.companyUsersService.editCompanyUser(companyUser, this.idCompany).subscribe(gro =>
      {
        if (gro.error != '')
          this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
        else
        {
          this.logAction(this.idCompany, false, Actions.Add, '', this.getCurrentLabelValue('lblEditedUser') + ' ' + companyUser.email, true);
        }
        this.loadUsers(companyUser.id);
      });
    }
  }
  onDelete()
  {
    this.companyUsersService.deleteCompanyUser(this.selectedUser.id, this.idCompany).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', this.getCurrentLabelValue('lblDeletedUser') + ' ' + this.selectedUser.email, true);
        this.loadUsers();
      }
    });
  }
}
