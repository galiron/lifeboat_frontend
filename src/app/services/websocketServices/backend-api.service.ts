import {Injectable} from '@angular/core';
import {ConnectionState} from 'src/app/enums/connectionstate';
import {
  Instruction,
  WSControlTransferResponse,
  WSJwtMessage,
  WSJwtResponse,
  WSLockReleaseResponse,
  WSRequestControlTransferToBackend,
  WSSteeringRequest,
  WSThrottleRequest
} from 'src/app/interfaces/Interfaces';
import {BackendConnectorService} from './backend-connector.service';

@Injectable({
  providedIn: 'root'
})
export class BackendAPIService {
  jwt = ''; // api requests need jwt

  constructor(private backendConnectorService: BackendConnectorService) {
    this.backendConnectorService.wsJwtResponse$.subscribe((data: WSJwtResponse) => {
      if (this.jwt === "" && data.jwt != "") {
        this.jwt = data.jwt;
        this.backendConnectorService.wsConnectionState$.next(ConnectionState.CONNECTED_WITH_CONTROL);
      }
    });
    this.backendConnectorService.wsLockReleaseResponse$.subscribe((data: WSLockReleaseResponse) => {
      if (data.success) {
        this.jwt = '';
      }
    });
  }

  transferControl(identifier: string | undefined): void {
    let success = false;
    if (identifier) {
      success = true;
    } else {
      identifier = "";
    }
    const data: WSControlTransferResponse = {
      success,
      jwt: this.jwt,
      identifier,
      interfaceType: "WSControlTransferResponse"
    };
    this.backendConnectorService.emit("transferControl", data);
  }

  declineControl(identifier: string | undefined): void {
    let success = false;
    if (identifier) {
      success = true;
    } else {
      identifier = "";
    }
    const data: WSControlTransferResponse = {
      success,
      jwt: this.jwt,
      identifier,
      interfaceType: "WSControlTransferResponse"
    };
    this.backendConnectorService.emit("transferControlDeclined", data);
  }

  sendThrottle(value: number): void {
    const instruction: Instruction = {value};
    const data: WSThrottleRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSThrottleRequest"
    };
    this.backendConnectorService.emit('throttle', data);
  }

  sendSteering(value: number): void {
    const instruction: Instruction = {value};
    const data: WSSteeringRequest = {
      jwt: this.jwt,
      instruction,
      interfaceType: "WSSteeringRequest"
    };
    this.backendConnectorService.emit('steer', data);
  }

  claimLock(username: string, password: string): void {
    const data = {
      "username": username,
      "password": password,
      interfaceType: "WSLockRequest"
    };
    this.backendConnectorService.emit('lock', data);
  }

  releaseLock(): void {
    const data: WSJwtMessage = {
      jwt: this.jwt,
      interfaceType: "JWTResponse"
    };
    this.backendConnectorService.emit('unlock', data);
  }

  requestControlTransfer(username: string, password: string): void {

    const data: WSRequestControlTransferToBackend = {
      username,
      interfaceType: "WSRequestControlTransfer",
      password
    };
    this.backendConnectorService.emit('requestControlTransfer', data);
  }

  feedWatchdog(): void {
    const data = {
      jwt: this.jwt
    };
    this.backendConnectorService.emit('feedWatchdog', data);
  }

  feedVigilanceControl(): void {
    const data = {
      jwt: this.jwt
    };
    this.backendConnectorService.emit('feedVigilanceControl', data);
  }
}
