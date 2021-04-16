import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-production-table',
  templateUrl: './production-table.component.html',
  styleUrls: ['./production-table.component.css']
})
export class ProductionTableComponent implements OnInit {
  @Input() productionList;
  constructor() { }

  ngOnInit(): void {
  }

}
