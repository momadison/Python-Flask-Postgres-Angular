import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-viz-one',
  templateUrl: './viz-one.component.html',
  styleUrls: ['./viz-one.component.css']
})

export class VizOneComponent implements OnInit {

  constructor() { }

  data: {email: string, hometown: string, name: string, rank: number, wipeouts: number}[] = [];
  
  name:FormControl = new FormControl('');
  email:FormControl = new FormControl('');
  hometown:FormControl = new FormControl('');
  rank:FormControl = new FormControl();
  wipeouts:FormControl = new FormControl();

  ngOnInit(): void {
    this.getData();
  }

  submit() {
    const submission = {
      name: this.name.value,
      email: this.email.value,
      hometown: this.hometown.value,
      rank: this.rank.value,
      wipeouts: this.wipeouts.value
    }
    this.postData(submission);
    this.name.reset();
    this.email.reset();
    this.hometown.reset();
    this.rank.reset();
    this.wipeouts.reset();
  }

  getData() {
    //dev environment
    axios.get('http://localhost:5000/values', {})
    //prod environment
    // axios.get('/api/values', {})
    .then((response) => {
      this.data = response.data.data
    })
  }

  postData(values:{name:string, email:string, hometown:string, rank:number, wipeouts:number}) {
    axios.post('http://localhost:5000/values', {name: values.name, email: values.email, hometown: values.hometown, rank: values.rank, wipeouts: values.wipeouts})
    //prod environment
    // axios.post('/api/values', {email: "anotheremail@gmail.com"})
    .then((response) => {
      console.log(response.data)
      this.getData();
    })

  }

}
