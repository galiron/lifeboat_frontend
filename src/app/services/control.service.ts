import { AccessControlService } from './access-control.service';
import { ChangeContext } from '@angular-slider/ngx-slider';
import { Injectable } from '@angular/core';
import { WebsocketAPIService } from './websocket-api.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private websocketAPIService: WebsocketAPIService, private accessControlService: AccessControlService) { }

  sendThrottle(changeContext: ChangeContext): void {
    this.websocketAPIService.sendThrottle(changeContext.value);
  }

  sendSteering(changeContext: ChangeContext): void {
    this.websocketAPIService.sendSteering(changeContext.value);
  }
}
