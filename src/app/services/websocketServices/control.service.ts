import {ChangeContext} from '@angular-slider/ngx-slider';
import {Injectable} from '@angular/core';
import {BackendAPIService} from './backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private backendAPIService: BackendAPIService) {
  }

  sendThrottle(changeContext: ChangeContext): void {
    this.backendAPIService.sendThrottle(changeContext.value);
  }

  sendSteering(changeContext: ChangeContext): void {
    this.backendAPIService.sendSteering(changeContext.value);
  }
}
