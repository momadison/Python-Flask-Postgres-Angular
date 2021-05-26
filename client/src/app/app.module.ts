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
import { OperatorModalComponent } from './Components/operator-modal/operator-modal.component';
import { DashboardWellreporterComponent } from './Components/dashboard-wellreporter/dashboard-wellreporter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    LineGraphComponent,
    OperatorModalComponent,
    DashboardWellreporterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
