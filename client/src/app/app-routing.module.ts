import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VizOneComponent } from './Components/viz-one/viz-one.component';
import { VizTwoComponent } from './Components/viz-two/viz-two.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';


const routes: Routes = [
  { path: '' , component: DashboardComponent },
  { path: 'viz1', component: VizOneComponent},
  { path: 'viz2', component: VizTwoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
