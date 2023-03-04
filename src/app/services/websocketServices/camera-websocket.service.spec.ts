import { TestBed } from '@angular/core/testing';

import { CameraWebsocketService } from './camera-websocket.service';

describe('CameraWebsocketService', () => {
  let service: CameraWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
