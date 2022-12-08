import { WebsocketService } from './websocket.service';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { AccessControlService } from './access-control.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { WebsocketMockService } from '../mocks/websocket-mock.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('claimControl', () => {
    expect(service.claimControl()).toBeUndefined();
  });

  it('releaseControl', () => {
    expect(service.releaseControl()).toBeUndefined();
  });

  it('feedWatchdog', () => {
    expect(service.feedWatchdog()).toBeUndefined();
  });

  it('makeRandom', () => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    const lengthOfCode = 40;
    expect(service.makeRandom(lengthOfCode,possible).length).toBe(40);
  });
});

describe('AccessControlServiceAsync', () => {
  let service: AccessControlService;
  let wss: WebsocketMockService
  beforeEach(() => {
    wss = new WebsocketMockService();
    TestBed.configureTestingModule({
      providers: [
        {provide: WebsocketService, useValue: wss}
      ]
    });
    service = TestBed.inject(AccessControlService);
  });

  it('subscribe', fakeAsync(() => {

    expect(service.jwt).toBe('');
    wss.subject.next({
      success: true,
      interfaceType: "WSJwtReply",
      jwt: "abc"
    });
    expect(service.jwt).toBe('abc');
    wss.subject.next({
      success: true,
      interfaceType: "WSReply"
    });
    expect(service).toBeTruthy();
    wss.subject.next({
      success: true,
      interfaceType: "WSFeedDogRequest"
    });
    expect(service).toBeTruthy();
    wss.subject.next(new Error("Test error"));
    expect(service).toBeTruthy();
    wss.subject.complete();
    expect(service).toBeTruthy();
  }));
});
