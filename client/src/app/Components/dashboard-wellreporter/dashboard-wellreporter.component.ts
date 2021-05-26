import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-dashboard-wellreporter',
  templateUrl: './dashboard-wellreporter.component.html',
  styleUrls: ['./dashboard-wellreporter.component.css']
})
export class DashboardWellreporterComponent implements OnInit {
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  
  constructor() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 1)),
      end: new FormControl(new Date(year, month, 28))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });
   }
  operatorList = [];
  productionList = [];
  leaseList = [];
  leases;
  operatorId = '521182'
  operatorModal:boolean = true;
  leaseLive:boolean = false;
  windowHeight;
  
  ngOnInit(): void {
    this.getOperator(this.operatorId);
    this.windowHeight = window.innerHeight;
  }

  onResize() {
    this.windowHeight = window.innerHeight;
  }

  getOperator(operatorId) {
    this.operatorModal = false;
    axios.post('http://localhost:5000/operator', {id: operatorId})
    //prod environment
    // axios.post('/api/values', {email: "anotheremail@gmail.com"})
    .then((response) => {
      console.log("replacing data")
      this.operatorList = response.data;
      this.getLeases(operatorId);
    })
  }

  getLeases(operatorId) {
    console.log(`here is what i am passing ${operatorId} and here is ${this.operatorId}`)
    axios.post('http://localhost:5000/leases', {id: operatorId})
    //prod environment
    // axios.post('/api/values', {email: "anotheremail@gmail.com"})
    .then((response) => {
      this.leaseList = response.data;
      console.log("response: ", response.data)
    })
  }

  getWells(leaseId, district, operator) {
    this.leaseLive = true;
    axios.post('http://localhost:5000/production', {id: leaseId, district: district, operator: operator})
    .then((response) => {
      console.log("response:? ", response.data)
      this.productionList = response.data;
    })
  }

  getDates() {
    console.log(`it changed ${this.campaignOne.value.start}`)
  }

}
