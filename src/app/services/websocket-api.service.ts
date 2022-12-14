import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Instruction, messageIsOfInterface, WSControlTransferResponse, WSJwtMessage, WSLockReleaseResponse, WSSteeringRequest, WSThrottleRequest } from '../interfaces/wsInterfaces';
import { WebsocketConnectorService } from './websocketConnector.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketAPIService {
  jwt = ''; // api requests need jwt

  constructor(private websocketConnectorService: WebsocketConnectorService) {
    this.websocketConnectorService.getSubsciption().subscribe((untypedMsg) => {
      try{
        if (messageIsOfInterface(untypedMsg,"WSJwtMessage")) {
          const msg = (untypedMsg as WSJwtMessage)
          if(this.jwt === "" && msg.jwt != "") {
            this.jwt = msg.jwt;
          }
        }
        if (messageIsOfInterface(untypedMsg,"WSLockReleaseResponse")) {
          const msg = (untypedMsg as WSLockReleaseResponse)
          if(msg.success) {
            this.jwt = ''
          }
        }   
      } catch(err: any) {
        console.log(err)
      }
    });
   }

  //subject to subscribe for incoming data
  getSocketSubject() : WebSocketSubject<any>{
    return this.websocketConnectorService.getSubsciption();
  }

  transferControl(identifier: string | undefined) {
    let success = false;
    if(identifier) {
      success = true;
    } else {
      identifier = ""
    }
    const data: WSControlTransferResponse = {
      success,
      jwt: this.jwt,
      identifier,
      interfaceType: "WSControlTransferResponse"
    }
    this.websocketConnectorService.emit({api: "transferControl", data, interfaceType: "WSControlTransferResponse"});
  }

  sendThrottle(value: number) {
    const instruction: Instruction = { value }
    const data: WSThrottleRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSThrottleRequest"
    }
    this.websocketConnectorService.emit({api:'throttle', data, interfaceType: "WSThrottleRequest"});
  }

  sendSteering(value: number) {
    const instruction : Instruction = { value }
    const data: WSSteeringRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSSteeringRequest"
    }
    this.websocketConnectorService.emit({api:'steer', data, interfaceType: "WSSteeringRequest"});
  }

  claimLock(secretKey: string) {
    const data = { "secretKey": secretKey }
    this.websocketConnectorService.emit({api:'lock', data, interfaceType: "secretKey"});
  }

  releaseLock() {
    const data: WSJwtMessage = {
      jwt: this.jwt,
      interfaceType: "JWTResponse"
    }
    this.websocketConnectorService.emit({api:'unlock', data, interfaceType: "JWTResponse"});
  }

  feedWatchdog(){
    const data = {
      jwt: this.jwt
    }
    this.websocketConnectorService.emit({api:'feedWatchdog', data, interfaceType: "watchdogResponse"});
  }
}
