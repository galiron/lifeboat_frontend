import { AccessControlService } from './access-control.service';
import { WebsocketService } from './websocket.service';
import { ChangeContext } from '@angular-slider/ngx-slider';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private websocketService: WebsocketService, private accessControlService: AccessControlService) { }

  sendThrottle(changeContext: ChangeContext): void {
    const instruction = { value : changeContext.value }
    const data = {
      jwt: this.accessControlService.jwt,
      instruction
    }
    this.websocketService.emit({api:'throttle', data, interfaceType: "WSThrottleRequest"});
  }

  sendSteering(changeContext: ChangeContext): void {
    const instruction = { value : changeContext.value }
    const data = {
      jwt: this.accessControlService.jwt,
      instruction
    }
    this.websocketService.emit({api:'steer', data, interfaceType: "WSSteeringRequest"});
  }
}
