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
  productionShownList = [];
  leaseList = [];
  leases;
  operatorId = '521182'
  operatorModal:boolean = true;
  leaseLive:boolean = false;
  windowHeight;
  
  ngOnInit(): void {
    this.getOperator(this.operatorId);
    this.windowHeight = window.innerHeight;
    console.log(`initial values ${this.campaignOne.value.start} and ${this.campaignOne.value.end}`)
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
      // console.log("converted dates:? ", this.dates.convert("2020/01/12"))
      // console.log("selected start date: ", this.campaignOne.value.start)
      // console.log("selected start end: ", this.campaignOne.value.end)
      // console.log("string test of dates in range", this.dates.inRange("2020/01/12", "2020/01/01", "2020/02/03"))
      this.productionList = response.data;
      this.productionShownList = response.data;
    })
  }

  // inRange(d, start, end) {
  //   // Checks if date in d is between dates in start and end.
  //   // Returns a boolean or NaN:
  //   //    true  : if d is between start and end (inclusive)
  //   //    false : if d is before start or after end
  //   //    NaN   : if one or more of the dates is illegal.
  //   // NOTE: The code inside isFinite does an assignment (=).
  //  return (
  //       isFinite(d=this.convert(d).valueOf()) &&
  //       isFinite(start=this.convert(start).valueOf()) &&
  //       isFinite(end=this.convert(end).valueOf()) ?
  //       start <= d && d <= end :
  //       NaN
  //   );
  // }

  getDates() {
    if (this.campaignOne.value.end !== null) {
      console.log(`it changed ${this.campaignOne.value.start}`)
      console.log(`it changed ${this.campaignOne.value.end}`)
      // let start = this.campaignOne.value.start.toISOString().slice(0,10).replace(/-/g,"").toString();
      // start = start.substring(0,4)+"/"+start.substring(4,6)+"/"+start.substring(6)
      // let end = this.campaignOne.value.end.toISOString().slice(0,10).replace(/-/g,"").toString();
      // end = end.substring(0,4)+"/"+end.substring(4,6)+"/"+end.substring(6)

      // this.productionShownList = this.productionList.filter(production => {
      //   const month = production.month === "Jan" ? "01" : 
      //                 production.month === "Feb" ? "02" :
      //                 production.month === "Mar" ? "03" :
      //                 production.month === "Apr" ? "04" :
      //                 production.month === "May" ? "05" :
      //                 production.month === "Jun" ? "06" :
      //                 production.month === "Jul" ? "07" :
      //                 production.month === "Aug" ? "08" :
      //                 production.month === "Sep" ? "09" :
      //                 production.month === "Oct" ? "10" :
      //                 production.month === "Nov" ? "11" :
      //                 production.month === "Dec" ? "12" : "01"
      //   const stringDate = production.year+"/"+month+"/"+"01"
      //   console.log("here is stringDate: ", stringDate)
      //   return this.dates.inRange(stringDate, start, end);
      // })

      // console.log("here is the filtered production: ", this.productionShownList)
    }
    
  }

//   dates = {
//     convert:function(d) {
//         // Converts the date in d to a date-object. The input can be:
//         //   a date object: returned without modification
//         //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
//         //   a number     : Interpreted as number of milliseconds
//         //                  since 1 Jan 1970 (a timestamp) 
//         //   a string     : Any format supported by the javascript engine, like
//         //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
//         //  an object     : Interpreted as an object with year, month and date
//         //                  attributes.  **NOTE** month is 0-11.
//         return (
//             d.constructor === Date ? d :
//             d.constructor === Array ? new Date(d[0],d[1],d[2]) :
//             d.constructor === Number ? new Date(d) :
//             d.constructor === String ? new Date(d) :
//             typeof d === "object" ? new Date(d.year,d.month,d.date) :
//             NaN
//         );
//     },
//     compare:function(a,b) {
//         // Compare two dates (could be of any type supported by the convert
//         // function above) and returns:
//         //  -1 : if a < b
//         //   0 : if a = b
//         //   1 : if a > b
//         // NaN : if a or b is an illegal date
//         // NOTE: The code inside isFinite does an assignment (=).
//         return (
//             isFinite(a=this.convert(a).valueOf()) &&
//             isFinite(b=this.convert(b).valueOf()) ?
//             (a>b)-(a<b) :
//             NaN
//         );
//     },
//     inRange:function(d,start,end) {
//         // Checks if date in d is between dates in start and end.
//         // Returns a boolean or NaN:
//         //    true  : if d is between start and end (inclusive)
//         //    false : if d is before start or after end
//         //    NaN   : if one or more of the dates is illegal.
//         // NOTE: The code inside isFinite does an assignment (=).
//        return (
//             isFinite(d=this.convert(d).valueOf()) &&
//             isFinite(start=this.convert(start).valueOf()) &&
//             isFinite(end=this.convert(end).valueOf()) ?
//             start <= d && d <= end :
//             NaN
//         );
//     }
// }

}
