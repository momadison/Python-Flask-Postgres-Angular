import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('animationSandbox') private animationSandbox: ElementRef<HTMLDivElement>;
  anotherVariable;
  tileDiv;
  constructor() { }
  confetti:boolean = false;
  ngOnInit(): void {
    setTimeout(() => {
      this.confetti = true;
      console.log("right after setting the confetti to true: ", this.animationSandbox)
    }, 500) 
    setTimeout(() => {
      console.log("animationSandbox just a little bit later: ", this.animationSandbox)
      this.tileDiv = this.animationSandbox.nativeElement.getBoundingClientRect();
    }, 1000)
  }


}
