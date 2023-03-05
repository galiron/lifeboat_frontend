import {ChangeContext} from '@angular-slider/ngx-slider';
import {Injectable} from '@angular/core';
import {BackendAPIService} from './backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private websocketAPIService: BackendAPIService) {
  }

  sendThrottle(changeContext: ChangeContext): void {
    this.websocketAPIService.sendThrottle(changeContext.value);
  }

  sendSteering(changeContext: ChangeContext): void {
    this.websocketAPIService.sendSteering(changeContext.value);
  }
}
