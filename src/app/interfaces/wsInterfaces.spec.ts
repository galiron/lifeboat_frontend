import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WSFeedDogRequest, messageIsOfInterface, WSConnectionTerminated, WSSteeringRequest, WSThrottleRequest, WSMessage, WSJwtMessage } from './wsInterfaces';


describe('WSInterfaces', () => {

  it('messageIsOfInterface', () => {
    const wSFeedDogRequestMessage: WSFeedDogRequest = {
        interfaceType: "WSFeedDogRequest"
    }
    expect(messageIsOfInterface(wSFeedDogRequestMessage, "WSFeedDogRequest")).toBeTrue();
    const wSConnectionTerminated: WSConnectionTerminated = {
        interfaceType: "WSConnectionTerminated"
    }
    expect(messageIsOfInterface(wSConnectionTerminated, "WSConnectionTerminated")).toBeTrue();
    const wSSteeringRequest: WSSteeringRequest = {
        jwt: "test",
        instruction: {value:1},
        interfaceType: "WSSteeringRequest"
    }
    expect(messageIsOfInterface(wSSteeringRequest, "WSSteeringRequest")).toBeTrue();
    const wSThrottleRequest: WSThrottleRequest = {
        jwt: "test",
        instruction: {value:1},
        interfaceType: "WSThrottleRequest"
    }
    expect(messageIsOfInterface(wSThrottleRequest, "WSThrottleRequest")).toBeTrue();
    const wSJwtMessage: WSJwtMessage = {
        interfaceType: "WSJwtMessage",
        jwt: "abc"
    }
    expect(messageIsOfInterface(wSJwtMessage, "WSJwtMessage")).toBeTrue();
    const wSMessage: WSMessage = {
        interfaceType: "WSMessage"
    }
    expect(messageIsOfInterface(wSMessage, "WSMessage")).toBeTrue();
    const faultyMessage: WSMessage = {
        interfaceType: "FaultMessage"
    }
    expect(messageIsOfInterface(faultyMessage, "WSMessage")).toBeFalse();
  });
});
