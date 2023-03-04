import { TestBed } from '@angular/core/testing';

import { ConfigAuthGuardService } from './config-auth-guard.service';

describe('ConfigAuthGuardService', () => {
  let service: ConfigAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
