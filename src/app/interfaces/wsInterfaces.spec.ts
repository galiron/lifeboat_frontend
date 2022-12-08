import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WSFeedDogRequest, messageIsOfInterface, WSConnectionTerminated, WSSteeringRequest, WSJwtReply, WSThrottleRequest, WSReply } from './wsInterfaces';


describe('WSInterfaces', () => {

  it('messageIsOfInterface', () => {
    const wSFeedDogRequestMessage: WSFeedDogRequest = {
        success: true,
        interfaceType: "WSFeedDogRequest"
    }
    expect(messageIsOfInterface(wSFeedDogRequestMessage, "WSFeedDogRequest")).toBeTrue();
    const wSConnectionTerminated: WSConnectionTerminated = {
        success: true,
        interfaceType: "WSConnectionTerminated"
    }
    expect(messageIsOfInterface(wSConnectionTerminated, "WSConnectionTerminated")).toBeTrue();
    const wSSteeringRequest: WSSteeringRequest = {
        success: true,
        interfaceType: "WSSteeringRequest"
    }
    expect(messageIsOfInterface(wSSteeringRequest, "WSSteeringRequest")).toBeTrue();
    const wSThrottleRequest: WSThrottleRequest = {
        success: true,
        interfaceType: "WSThrottleRequest"
    }
    expect(messageIsOfInterface(wSThrottleRequest, "WSThrottleRequest")).toBeTrue();
    const wSJwtReply: WSJwtReply = {
        success: true,
        interfaceType: "WSJwtReply",
        jwt: "abc"
    }
    expect(messageIsOfInterface(wSJwtReply, "WSJwtReply")).toBeTrue();
    const wSReply: WSReply = {
        success: true,
        interfaceType: "WSReply"
    }
    expect(messageIsOfInterface(wSReply, "WSReply")).toBeTrue();
    const faultyMessage: WSReply = {
        success: true,
        interfaceType: "FaultMessage"
    }
    expect(messageIsOfInterface(faultyMessage, "WSReply")).toBeFalse();
  });
});
