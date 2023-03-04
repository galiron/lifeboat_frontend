import { fakeAsync, TestBed } from '@angular/core/testing';

import { WebsocketConnectorService } from './websocketConnector.service';

describe('WebsocketConnectorService', () => {
  let service: WebsocketConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emit', () => {
    expect(service.emit({"foo": "bar"})).toBeUndefined();
  });
});
