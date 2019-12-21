import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base-component';

@Component({
  selector: 'bf-generic-confirm-dialog',
  templateUrl: './generic-confirm-dialog.component.html',
  styleUrls: ['./generic-confirm-dialog.component.css']
})
export class GenericConfirmDialogComponent extends BaseComponent implements OnInit 
{
  @Input() confirmMessage: string = "Are you sure?";
  @Output() onConfirm = new EventEmitter<string>();

  constructor(private injector: Injector)
  {
    super(injector,
      ['lblYes',
        'lblNo']);
  }

  ngOnInit() 
  {
  }

  onConfirmClick()
  {
    this.onConfirm.emit('yes');
  }
  onCancelClick()
  {
    this.onConfirm.emit('no');
  }

}
