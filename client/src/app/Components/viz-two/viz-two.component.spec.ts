import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VizTwoComponent } from './viz-two.component';

describe('VizTwoComponent', () => {
  let component: VizTwoComponent;
  let fixture: ComponentFixture<VizTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VizTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VizTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
