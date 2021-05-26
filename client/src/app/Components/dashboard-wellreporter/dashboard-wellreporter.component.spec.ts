import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWellreporterComponent } from './dashboard-wellreporter.component';

describe('DashboardWellreporterComponent', () => {
  let component: DashboardWellreporterComponent;
  let fixture: ComponentFixture<DashboardWellreporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWellreporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWellreporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
