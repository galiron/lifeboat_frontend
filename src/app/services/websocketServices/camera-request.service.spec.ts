import { TestBed } from '@angular/core/testing';

import { CameraRequestService } from './camera-request.service';

describe('CameraRequestService', () => {
  let service: CameraRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
