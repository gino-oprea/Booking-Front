import { LevelLinkingService } from '../../app-services/level-linking.service';
import { TreeNode } from 'primeng/primeng';
import { LevelsService } from '../../app-services/levels.service';
import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';
import { Level } from '../../objects/level';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { EntitiesService } from '../../app-services/entities.service';
import { Entity } from '../../objects/entity';
import { EntitiesLink } from '../../objects/entities-link';
import { Booking } from '../../objects/booking';


@Component({
  selector: 'bf-level-linking',
  templateUrl: './level-linking.component.html',
  styleUrls: ['./level-linking.component.css']
})
export class LevelLinkingComponent extends BaseComponent implements OnInit 
{
  levels: Level[] = [];
  entities: Entity[] = [];
  entityLinks: EntitiesLink[] = [];
  nextEntities: Entity[] = [];
  selectedLevel: Level;
  selectedEntity: Entity;

  linkTreeData: TreeNode[] = [];

  displayAffectedBookings: boolean = false;
  affectedBookings: Booking[] = [];


  constructor(private injector: Injector,
    private levelsService: LevelsService,
    private entitiesService: EntitiesService,
    private levelLinkingService: LevelLinkingService)
  {
    super(injector, []);
    this.site = WebSites.Back;
    this.pageName = "Level linking";
    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });

    this.loadLevels();
  }

  ngOnInit()
  {
    this.logAction(this.idCompany, false, Actions.View, '', '');
    this.loadTree();
  }
  loadTree()
  {
    this.linkTreeData = [];
    this.levelLinkingService.getEntitiesLinkingTree(this.idCompany, "Root", this.currentCulture).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.linkTreeData = <TreeNode[]>gro.objList;
        }
      }

    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities tree', ''));
  }

  loadLevels()
  {
    this.levelsService.getLevels(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.levels = (<Level[]>gro.objList).sort((l1, l2) => l1.orderIndex - l2.orderIndex);
          this.selectedLevel = this.levels[0];
          this.loadEntities();
        }
      }

    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting levels', ''));
  }
  loadEntities()
  {
    let id = this.selectedLevel.id;
    this.entitiesService.getEntities(id, null).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Search, '', 'load entities');

        this.entities = <Entity[]>gro.objList;
        if (gro.objList.length > 0)
        {
          this.selectedEntity = this.entities[0];
          this.loadEntitiesLinking(this.selectedEntity.id);
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities', ''));
  }
  loadNextLevelEntities()
  {
    let id = this.selectedLevel.id;
    id = this.getNextLevelId();
    if (id != null)
    {
      this.entitiesService.getEntities(id, null).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
          //this.showPageMessage('error', 'Error', gro.error);
        }
        else
        {
          this.logAction(this.idCompany, false, Actions.Search, '', 'load entities');
          this.nextEntities = <Entity[]>gro.objList;
        }
      },
        err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities', ''));
    }
    else
    {
      this.nextEntities = [];
    }
  }
  loadEntitiesLinking(idEnt: number)
  {
    this.levelLinkingService.getEntitiesLinking(idEnt, this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.entityLinks = <EntitiesLink[]>gro.objList;
        this.loadNextLevelEntities();
      }
    },
      er => this.logAction(this.idCompany, true, Actions.Search, 'http error getting entities linking', ''));
  }
  isCheckedEntity(idChildEntity: number)
  {
    let isChecked = false;
    for (var i = 0; i < this.entityLinks.length; i++) 
    {
      if (this.entityLinks[i].idParentEntity == this.selectedEntity.id && this.entityLinks[i].idChildEntity == idChildEntity)
      {
        isChecked = true;
        break;
      }
    }
    return isChecked;
  }
  getNextLevelId(): number
  {
    let index = -1;

    for (var i = 0; i < this.levels.length; i++) 
    {
      if (this.levels[i].id == this.selectedLevel.id)     
      {
        if (i < this.levels.length - 1)
        {
          index = i + 1;
          break;
        }
      }
    }
    if (index > -1)
    {
      let id = this.levels[index].id;
      return id;
    }
    else
      return null;
  }
  selectLevel(level: Level)
  {
    this.selectedLevel = level;
    this.loadEntities();
  }
  selectEntity(entity: Entity)
  {
    this.selectedEntity = entity;
    this.loadEntitiesLinking(this.selectedEntity.id);
  }
  updateLevel(level: Level)
  {
    this.levelsService.updateLevel(level).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed, true);
        //this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        //this.showPageMessage('success', 'Saved', '');
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Edit, 'http error changing level order index', ''));
  }
  levelMove(type: string)
  {
    let currentIndex;
    for (var i = 0; i < this.levels.length; i++) 
    {
      if (this.levels[i].id == this.selectedLevel.id)     
      {
        currentIndex = i;
        break;
      }
    }

    this.levelLinkingService.removeEntitiesLinkingOnLevelOrderChange(this.selectedLevel.id, type == 'up' ? true : false).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed, true);


        if (gro.objList != null && gro.objList.length > 0)
        {
          this.affectedBookings = gro.objList;
          this.displayAffectedBookings = true;
        }
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'delete entity links before level order change', true, 'links between selected level and others deleted!', true);
        //this.showPageMessage('warn', 'Warning', 'links between selected level and others deleted!');

        if (type == 'up')
        {
          if (currentIndex > 0)
          {
            let aux = this.levels[currentIndex - 1];

            this.levels[currentIndex - 1] = this.selectedLevel;
            this.levels[currentIndex - 1].orderIndex = this.levels[currentIndex - 1].orderIndex - 1;
            this.updateLevel(this.levels[currentIndex - 1]);

            this.levels[currentIndex] = aux;
            this.levels[currentIndex].orderIndex = this.levels[currentIndex].orderIndex + 1;
            this.updateLevel(this.levels[currentIndex]);
          }
        }
        if (type == 'down')
        {
          if (currentIndex < (this.levels.length - 1))
          {
            let aux = this.levels[currentIndex + 1];

            this.levels[currentIndex + 1] = this.selectedLevel;
            this.levels[currentIndex + 1].orderIndex = this.levels[currentIndex + 1].orderIndex + 1;
            this.updateLevel(this.levels[currentIndex + 1]);

            this.levels[currentIndex] = aux;
            this.levels[currentIndex].orderIndex = this.levels[currentIndex].orderIndex - 1;
            this.updateLevel(this.levels[currentIndex]);
          }
        }

        this.loadEntities();
      }

      this.loadTree();

    },
      err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleting entity links before level order change', ''));
  }
  onLinkChange(e, ent: Entity)
  {
    let entLink: EntitiesLink = new EntitiesLink(this.selectedEntity.id, ent.id);
    this.levelLinkingService.setEntitiesLinking(entLink, e.target.checked).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        e.target.checked = !e.target.checked;

        this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed, true);

        if (gro.objList != null && gro.objList.length > 0)
        {
          this.affectedBookings = gro.objList;
          this.displayAffectedBookings = true;
        }
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Add, '', e.target.checked ? 'added entity link' : 'removed entity link', true, '');
        //this.showPageMessage('success', 'Saved', '');
      }

      this.loadTree();
    },
      err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding entities linking', ''));
  }

  onBookingRemoved(event: any)
  {
    //this.displayAffectedBookings = false;
    if (event.error == null)
    {
      this.logAction(this.idCompany, false, Actions.Delete, "", "", true, "Booking removed");
    }
    else
    {
      this.logAction(this.idCompany, true, Actions.Delete, event, event, true);
    }
  }
  onBookingMoved(event: any)
  {
    //this.displayAffectedBookings = false;
    if (event.error == null)
      this.logAction(this.idCompany, false, Actions.Edit, '', '', true, 'Booking edited');
    else
      this.logAction(this.idCompany, true, Actions.Edit, event, event, true);
  }
  onBookingCanceled(event: any)
  {
    //this.displayAffectedBookings = false;
    if (event.error == null)
    {
      this.logAction(this.idCompany, false, Actions.Cancel, "", "", true, "Booking canceled");
    }
    else
    {
      this.logAction(this.idCompany, true, Actions.Delete, event, event, true);
    }
  }
}
