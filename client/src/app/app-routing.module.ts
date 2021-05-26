import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VizOneComponent } from './Components/viz-one/viz-one.component';
import { VizTwoComponent } from './Components/viz-two/viz-two.component';
import { AnimationSandboxComponent } from './Components/animation-sandbox/animation-sandbox.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { OperatorTreeComponent } from './Components/operator-tree/operator-tree.component';
import { DashboardWellreporterComponent } from './Components/dashboard-wellreporter/dashboard-wellreporter.component';

const routes: Routes = [
  { path: '' , component: DashboardComponent },
  { path: 'viz1', component: VizOneComponent},
  { path: 'viz2', component: VizTwoComponent},
  { path: 'sandbox', component: AnimationSandboxComponent},
  { path: 'tree', component: OperatorTreeComponent},
  { path: 'dashboard', component: DashboardWellreporterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
