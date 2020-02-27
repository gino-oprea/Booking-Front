import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from 'app/enums/enums';
import { ActivatedRoute } from '@angular/router';
import { UserRole } from 'app/objects/user-role';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteModule } from '../../objects/site-module';
import { RolesService } from '../../app-services/roles.service';
import { SiteModulesService } from '../../app-services/site-modules.service';

@Component({
  selector: 'bf-company-roles',
  templateUrl: './company-roles.component.html',
  styleUrls: ['./company-roles.component.css']
})
export class CompanyRolesComponent extends BaseComponent implements OnInit 
{

  @Output() onRoleChange = new EventEmitter<string>();

  cols: any[];
  colsModule: any[];

  roles: UserRole[] = [];
  selectedRole: UserRole;
  isAddRoleMode: boolean = true;
  displayDialogRole: boolean = false;
  displayConfirmDeleteRole: boolean = false;

  siteModules: SiteModule[] = [];
  selectedSiteModules: SiteModule[] = [];

  addRoleForm: FormGroup;

  constructor(private injector: Injector,
    private rolesService: RolesService,    
    private siteModulesService: SiteModulesService)
  { 
    super(injector, []);

    this.site = WebSites.Back;
    this.pageName = "CompanyRoles";

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });

    this.cols = [
      { field: 'idRole', header: 'Id Role' },
      { field: 'roleName', header: 'Role Name' },      
      { field: 'isCompanyOwner', header: 'Is Owner' },
      { field: 'isEditable', header: 'Is Editable' }
    ];

    this.colsModule = [
      { field: 'name', header: 'Module Name' },
      { field: 'siteName', header: 'Site Name' }
    ];
  }

  ngOnInit()
  {
    super.ngOnInit();
    
    this.loadRoles(true);
    this.initFormAddRole();
  }
  initFormAddRole()
  {
    this.addRoleForm = new FormGroup({
      'roleName': new FormControl(this.isAddRoleMode ? '' : this.selectedRole.roleName, Validators.required)      
    });
  }
  getRoleFromForm(): UserRole
  {
    let role: UserRole = {
      idRole: this.isAddRoleMode ? null : this.selectedRole.idRole,
      roleName: this.addRoleForm.controls['roleName'].value,
      idCompany: this.idCompany
    };

    return role;
  }
  loadRoles(isInit: boolean = false)
  {
    this.rolesService.getRoles(this.idCompany).subscribe(gro =>
    {
      if (isInit)
        this.loadSiteModules();

      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.roles = <UserRole[]>gro.objList;
        if (this.selectedRole == null)
        {
          this.selectedRole = this.roles[0];
          this.loadSelectedSiteModules(this.selectedRole.idRole);
        }
      }
    });
  }
  loadSiteModules()
  {
    this.siteModulesService.getSiteModules().subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.siteModules = <SiteModule[]>gro.objList;
      }
    });
  }

  loadSelectedSiteModules(idRole: number = null)
  {
    this.siteModulesService.getSiteModulesByRole(idRole).subscribe(gro =>
    {
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      else
      {
        this.selectedSiteModules = <SiteModule[]>gro.objList;
      }
    });
  }

  onRowSelect()
  {
    this.loadSelectedSiteModules(this.selectedRole.idRole);
  }
  onAddClick()
  {
    this.isAddRoleMode = true;
    this.initFormAddRole();
    this.displayDialogRole = true;
  }
  onEditClick(role: UserRole)
  {
    this.isAddRoleMode = false;
    this.selectedRole = role;
    this.loadSelectedSiteModules(this.selectedRole.idRole);
    this.initFormAddRole();
    this.displayDialogRole = true;
  }
  onDeleteClick(role: UserRole)
  {
    this.selectedRole = role;
    this.displayConfirmDeleteRole = true;
  }

  onCancelDeleteRoleClick()
  {
    this.displayConfirmDeleteRole = false;
  }

  onConfirmDeleteRoleClick()
  {
    this.rolesService.deleteRole(this.selectedRole.idRole, true).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'Role deleted', true);        
      }

      this.loadRoles();

      this.onRoleChange.emit('changed');
    });

    this.displayConfirmDeleteRole = false;
  }

  onAddRoleFormSubmit()
  {
    let role = this.getRoleFromForm();
    this.rolesService.setRole(role).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, this.isAddRoleMode ? Actions.Add : Actions.Edit, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        this.logAction(this.idCompany, false, this.isAddRoleMode ? Actions.Add : Actions.Edit, '', this.isAddRoleMode ? 'Role added' : 'Role edited', true);         
      }

      this.loadRoles();
      this.displayDialogRole = false;

      this.onRoleChange.emit('changed');
    });
  }

  isCheckedModule(idModule: number)
  {
    return this.selectedSiteModules.filter(m => m.id == idModule).length > 0;
  }
  onModuleLinkChange(event, module: SiteModule)
  {
    if (event.target.checked)
      this.addRoleToModule(module.id);
    else
      this.deleteRoleToModule(module.id);
  }

  addRoleToModule(idModule: number)
  {
    this.rolesService.addRoleToModule(this.selectedRole.idRole, idModule).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);        
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add , '', 'Role to module added', true);                 
      }
      this.loadSelectedSiteModules(this.selectedRole.idRole);
    });
  }
  deleteRoleToModule(idModule: number)
  {
    this.rolesService.deleteRoleToModule(this.selectedRole.idRole, idModule).subscribe(gro =>
    {
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', 'Role to module deleted', true);          
      }
      this.loadSelectedSiteModules(this.selectedRole.idRole);
    });
  }
}
