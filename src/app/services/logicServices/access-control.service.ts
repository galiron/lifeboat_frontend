import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Queue} from 'queue-typescript';
import {
  WSRequestControlTransferToClient,
  WSMessage,
  WSControlAssignment,
  WSControlTransfer
} from 'src/app/interfaces/wsInterfaces';
import {IdentityService} from '../dataServices/identity.service';
import {BackendAPIService} from '../websocketServices/backend-api.service';
import {BackendConnectorService} from '../websocketServices/backend-connector.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  controlRequest$ = new Subject();
  controlRequester = new Queue<WSRequestControlTransferToClient>();
  requesterInProgress?: WSRequestControlTransferToClient | undefined;


  constructor(private websocketAPIService: BackendAPIService, private websocketConnectorService: BackendConnectorService, private identityService: IdentityService) {
    websocketConnectorService.wsMessage$.subscribe((data: WSMessage) => {
      // unused; listener for general ws Messages
    });
    websocketConnectorService.wsRequestControlTransferToClient$.subscribe((data: WSRequestControlTransferToClient) => {
      this.controlRequester.append(data);
      this.controlRequest$.next({});
    });
    websocketConnectorService.wsFeedDogRequest$.subscribe(() => {
      this.feedWatchdog();
    });
    websocketConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {
      if (assignment.jwt != "") {
        this.websocketAPIService.jwt = assignment.jwt
      }
    });
  }

  popNextRequester(): boolean {
    if (this.controlRequester.length > 0) {
      this.requesterInProgress = this.controlRequester.dequeue();
      return true
    } else {
      return false;
    }
  }

  declineControl(): void {
    let requester = this.requesterInProgress
    if (requester) {
      this.websocketAPIService.declineControl(requester.identifier);
    } else {
      this.websocketAPIService.declineControl(undefined);
    }
  }

  transferControl(): void {
    let requester = this.requesterInProgress;
    if (requester) {
      this.websocketAPIService.transferControl(requester.identifier);
      this.requesterInProgress = undefined;
    } else {
      this.websocketAPIService.transferControl(undefined);
    }
    this.requesterInProgress = undefined;
    this.controlRequester = new Queue<WSControlTransfer>();
  }


  requestControlTransfer(name: string): void {
    if (this.identityService.password) {
      this.websocketAPIService.requestControlTransfer(name, this.identityService.password)
    } else {
      console.log("can't request control without password");
    }
  }

  claimControl(): void {
    if (this.identityService.password) {
      this.websocketAPIService.claimLock(this.identityService.name, this.identityService.password);
    } else {
      console.log("can't request control without password");
    }
  }

  releaseControl(): void {
    this.websocketAPIService.releaseLock();
  }

  feedWatchdog(): void {
    this.websocketAPIService.feedWatchdog();
  }
}
