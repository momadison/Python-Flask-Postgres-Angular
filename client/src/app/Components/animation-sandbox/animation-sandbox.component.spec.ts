import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationSandboxComponent } from './animation-sandbox.component';

describe('AnimationSandboxComponent', () => {
  let component: AnimationSandboxComponent;
  let fixture: ComponentFixture<AnimationSandboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationSandboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationSandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
