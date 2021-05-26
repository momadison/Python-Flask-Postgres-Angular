import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-operator-modal',
  templateUrl: './operator-modal.component.html',
  styleUrls: ['./operator-modal.component.css']
})
export class OperatorModalComponent implements OnInit {
  @Output("getOperator") getOperator = new EventEmitter<Object>();

  constructor() { }

  operatorID:FormControl = new FormControl('');

  ngOnInit(): void {
  }

  operatorSearch = () => {
    console.log(this.operatorID.value)
    this.getOperator.emit(this.operatorID.value)
    this.operatorID.reset();
  }

}
