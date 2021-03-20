import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  confetti:boolean = false;
  ngOnInit(): void {
    setTimeout(()=> {
      this.confetti = true;
    }, 2000)
  }

}
