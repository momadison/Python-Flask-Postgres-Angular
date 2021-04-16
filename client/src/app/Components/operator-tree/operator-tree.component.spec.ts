import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorTreeComponent } from './operator-tree.component';

describe('OperatorTreeComponent', () => {
  let component: OperatorTreeComponent;
  let fixture: ComponentFixture<OperatorTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
