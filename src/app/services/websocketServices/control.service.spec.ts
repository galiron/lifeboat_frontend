import { ChangeContext } from '@angular-slider/ngx-slider';
import { TestBed } from '@angular/core/testing';

import { ControlService } from './control.service';

describe('ControlService', () => {
  let service: ControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlService);
  });

  it('sendThrottle', () => {
    let changeContext: ChangeContext =  {
      value: 1.1,
      highValue: 1.1,
      pointerType: 1
    }
    expect(service.sendThrottle(changeContext)).toBeUndefined();
    changeContext =  {
      value: 0,
      highValue: 0,
      pointerType: 0
    }
    expect(service.sendThrottle(changeContext)).toBeUndefined();
    changeContext =  {
      value: -1.1,
      highValue: -2.1,
      pointerType: 3
    }
    expect(service.sendThrottle(changeContext)).toBeUndefined();
  });

  it('sendSteering', () => {
    let changeContext: ChangeContext =  {
      value: 1,
      highValue: 1,
      pointerType: 1
    }
    expect(service.sendSteering(changeContext)).toBeUndefined();
    changeContext =  {
      value: 0,
      highValue: 0,
      pointerType: 0
    }
    expect(service.sendSteering(changeContext)).toBeUndefined();
    changeContext =  {
      value: -1.1,
      highValue: -2.1,
      pointerType: 3
    }
    expect(service.sendSteering(changeContext)).toBeUndefined();
  });
});
