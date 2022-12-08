import { ChangeContext } from '@angular-slider/ngx-slider';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedControlComponent } from './speed-control.component';

describe('SpeedControlComponent', () => {
  let component: SpeedControlComponent;
  let fixture: ComponentFixture<SpeedControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeedControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setThrottle', () => {
    let changeContext: ChangeContext =  {
      value: 1.1,
      highValue: 1.1,
      pointerType: 1
    }
    expect(component.setThrottle(changeContext)).toBeUndefined();
    changeContext =  {
      value: 0,
      highValue: 0,
      pointerType: 0
    }
    expect(component.setThrottle(changeContext)).toBeUndefined();
    changeContext =  {
      value: -1.1,
      highValue: -2.1,
      pointerType: 3
    }
    expect(component.setThrottle(changeContext)).toBeUndefined();
  });
});
