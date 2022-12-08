import { ChangeContext } from '@angular-slider/ngx-slider';
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

  it('setSteering', () => {
    let changeContext: ChangeContext =  {
      value: 1.1,
      highValue: 1.1,
      pointerType: 1
    }
    expect(component.setSteering(changeContext)).toBeUndefined();
    changeContext =  {
      value: 0,
      highValue: 0,
      pointerType: 0
    }
    expect(component.setSteering(changeContext)).toBeUndefined();
    changeContext =  {
      value: -1.1,
      highValue: -2.1,
      pointerType: 3
    }
    expect(component.setSteering(changeContext)).toBeUndefined();
  });
});
