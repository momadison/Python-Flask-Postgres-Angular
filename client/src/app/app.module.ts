import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { VizOneComponent } from './Components/viz-one/viz-one.component';
import { VizTwoComponent } from './Components/viz-two/viz-two.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ConfettiComponent } from './Components/confetti/confetti.component';
import { AnimationSandboxComponent } from './Components/animation-sandbox/animation-sandbox.component';
import { OperatorTreeComponent } from './Components/operator-tree/operator-tree.component';
import { ProductionTableComponent } from './Components/production-table/production-table.component';
import { LineGraphComponent } from './Components/line-graph/line-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    VizOneComponent,
    VizTwoComponent,
    DashboardComponent,
    NavbarComponent,
    ConfettiComponent,
    AnimationSandboxComponent,
    OperatorTreeComponent,
    ProductionTableComponent,
    LineGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
