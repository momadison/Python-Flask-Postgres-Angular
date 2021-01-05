import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VizOneComponent } from './viz-one.component';

describe('VizOneComponent', () => {
  let component: VizOneComponent;
  let fixture: ComponentFixture<VizOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VizOneComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VizOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
