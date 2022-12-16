import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Instruction, messageIsOfInterface, WSControlTransferResponse, WSJwtMessage, WSLockReleaseResponse, WSRequestControlTransferToBackend, WSSteeringRequest, WSThrottleRequest } from '../interfaces/wsInterfaces';
import { WebsocketConnectorService } from './websocketConnector.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketAPIService {
  jwt = ''; // api requests need jwt

  constructor(private websocketConnectorService: WebsocketConnectorService) {
    this.websocketConnectorService.wsJwtResponse$.subscribe((msg) => {
        if(this.jwt === "" && msg.jwt != "") {
          this.jwt = msg.jwt;
        }
    });
    this.websocketConnectorService.wsLockReleaseResponse$.subscribe((msg) => {
      if(msg.success) {
        this.jwt = ''
      }
    });
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
    this.websocketConnectorService.emit("transferControl", data);
  }

  sendThrottle(value: number) {
    const instruction: Instruction = { value }
    const data: WSThrottleRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSThrottleRequest"
    }
    this.websocketConnectorService.emit('throttle', data);
  }

  sendSteering(value: number) {
    const instruction : Instruction = { value }
    const data: WSSteeringRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSSteeringRequest"
    }
    this.websocketConnectorService.emit('steer', data);
  }

  claimLock(secretKey: string) {
    const data = { 
      "secretKey": secretKey, 
      interfaceType: "WSLockRequest"
    } 
    this.websocketConnectorService.emit('lock', data);
  }

  releaseLock() {
    const data: WSJwtMessage = {
      jwt: this.jwt,
      interfaceType: "JWTResponse"
    }
    this.websocketConnectorService.emit('unlock', data);
  }

  requestControlTransfer(secretKey: string) {
    
    const data: WSRequestControlTransferToBackend = {
      name: "this.jwt", // replace jwt with human readable names
      interfaceType: "WSRequestControlTransfer",
      secretKey
    }
    this.websocketConnectorService.emit('requestControlTransfer', data);
  }

  feedWatchdog(){
    const data = {
      jwt: this.jwt
    }
    this.websocketConnectorService.emit('feedWatchdog', data);
  }
}
