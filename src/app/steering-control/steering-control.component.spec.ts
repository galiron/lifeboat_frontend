import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteeringControlComponent } from './steering-control.component';

describe('SteeringControlComponent', () => {
  let component: SteeringControlComponent;
  let fixture: ComponentFixture<SteeringControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SteeringControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteeringControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
