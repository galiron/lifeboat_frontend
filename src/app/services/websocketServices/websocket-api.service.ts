import { Injectable } from '@angular/core';
import { ConnectionState } from 'src/app/enums/connectionstate';
import { WSJwtResponse, WSLockReleaseResponse, WSControlTransferResponse, Instruction, WSThrottleRequest, WSSteeringRequest, WSJwtMessage, WSRequestControlTransferToBackend } from 'src/app/interfaces/wsInterfaces';
import { WebsocketConnectorService } from './websocketConnector.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketAPIService {
  jwt = ''; // api requests need jwt

  constructor(private websocketConnectorService: WebsocketConnectorService) {
    this.websocketConnectorService.wsJwtResponse$.subscribe((data: WSJwtResponse) => {
        if(this.jwt === "" && data.jwt != "") {
          this.jwt = data.jwt;
          this.websocketConnectorService.wsConnectionState$.next(ConnectionState.CONNECTED_WITH_CONTROL)
        }
    });
    this.websocketConnectorService.wsLockReleaseResponse$.subscribe((data: WSLockReleaseResponse) => {
      if(data.success) {
        this.jwt = ''
      }
    });
   }

  transferControl(identifier: string | undefined) : void{
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

  declineControl(identifier: string | undefined) : void{
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
    this.websocketConnectorService.emit("transferControlDeclined", data);
  }

  sendThrottle(value: number) : void {
    const instruction: Instruction = { value }
    const data: WSThrottleRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSThrottleRequest"
    }
    this.websocketConnectorService.emit('throttle', data);
  }

  sendSteering(value: number) : void {
    const instruction : Instruction = { value }
    const data: WSSteeringRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSSteeringRequest"
    }
    this.websocketConnectorService.emit('steer', data);
  }

  claimLock(username: string, password: string) : void{
    const data = { 
      "username": username, 
      "password": password,
      interfaceType: "WSLockRequest"
    } 
    this.websocketConnectorService.emit('lock', data);
  }

  releaseLock() : void{
    const data: WSJwtMessage = {
      jwt: this.jwt,
      interfaceType: "JWTResponse"
    }
    this.websocketConnectorService.emit('unlock', data);
  }

  requestControlTransfer(username: string, password: string) : void{
    
    const data: WSRequestControlTransferToBackend = {
      username,
      interfaceType: "WSRequestControlTransfer",
      password
    }
    this.websocketConnectorService.emit('requestControlTransfer', data);
  }

  feedWatchdog() : void {
    const data = {
      jwt: this.jwt
    }
    this.websocketConnectorService.emit('feedWatchdog', data);
  }

  feedVigilanceControl() : void {
    const data = {
      jwt: this.jwt
    }
    this.websocketConnectorService.emit('feedVigilanceControl', data);
  }
}
