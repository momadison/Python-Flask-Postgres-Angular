import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { getMaxListeners } from 'process';

@Component({
  selector: 'app-viz-one',
  templateUrl: './viz-one.component.html',
  styleUrls: ['./viz-one.component.css']
})

export class VizOneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //dev environment
    axios.get('http://localhost:5000/values', {})
    //prod environment
    // axios.get('/api/values', {})
    .then((response) => {
      console.log(response)
    })

    axios.post('http://localhost:5000/values', {email: "anotheremail@gmail.com"})
    //prod environment
    // axios.post('/api/values', {email: "anotheremail@gmail.com"})
    .then((response) => {
      console.log(response)
    })

  }

}
