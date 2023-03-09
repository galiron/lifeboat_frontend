import {TestBed} from '@angular/core/testing';

import {ConfigGuardService} from './config-guard.service';

describe('ConfigGuardService', () => {
  let service: ConfigGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
