import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-operator-tree',
  templateUrl: './operator-tree.component.html',
  styleUrls: ['./operator-tree.component.css']
})
export class OperatorTreeComponent implements OnInit {

  constructor() { }
  operatorList = [];
  productionList = [];
  leaseList = [];
  leases;
  operatorId = '521182'
  operatorModal:boolean = true;
  ngOnInit(): void {
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
    axios.post('http://localhost:5000/production', {id: leaseId, district: district, operator: operator})
    .then((response) => {
      console.log("response:? ", response.data)
      this.productionList = response.data;
    })
  }
}
