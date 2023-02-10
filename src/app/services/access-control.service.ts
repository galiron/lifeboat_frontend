import { WebsocketConnectorService } from './websocketConnector.service';

import { Injectable } from '@angular/core';
import { messageIsOfInterface, WSFeedDogRequest, WSMessage, WSControlTransfer, WSRequestControlTransferToClient, WSControlAssignment } from '../interfaces/wsInterfaces';
import { Subject } from 'rxjs';
import { Queue } from 'queue-typescript';
import { WebsocketAPIService } from './websocket-api.service';
import { RandomGeneratorService } from './random-generator.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  controlRequest$ = new Subject();
  controlRequester = new Queue<WSRequestControlTransferToClient>();
  requesterInProgress?: WSRequestControlTransferToClient | undefined;
  secretKey: string = "";
  

  constructor(private websocketAPIService: WebsocketAPIService, private websocketConnectorService: WebsocketConnectorService, private randomGeneratorService: RandomGeneratorService) {
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
      if (assignment.jwt != ""){
        this.websocketAPIService.jwt = assignment.jwt
      }
      console.log("jwt is now: ", this.websocketAPIService.jwt)
    });
   }

  popNextRequester() : void {
    if(this.controlRequester.length > 0){
      this.requesterInProgress = this.controlRequester.dequeue();
    } else{
      this.requesterInProgress = undefined;
    }
  }

  declineControl() : void {
    let requester = this.requesterInProgress
    if (requester) {
      this.websocketAPIService.declineControl(requester.identifier);
    } else {
      this.websocketAPIService.declineControl(undefined);
    }
  }

  transferControl() : void {
    let requester = this.requesterInProgress
    if (requester) {
      this.websocketAPIService.transferControl(requester.identifier);
    } else {
      this.websocketAPIService.transferControl(undefined);
    }
    this.requesterInProgress = undefined;
    this.controlRequester = new Queue<WSControlTransfer>();
  }


  requestControlTransfer(name: string) : void {
    this.websocketAPIService.requestControlTransfer(name, this.secretKey)
  }

  claimControl() : void {
    if (this.secretKey == "") {
       this.secretKey = this.randomGeneratorService.makeRandom();
    }
    this.websocketAPIService.claimLock(this.secretKey);
  }

  releaseControl() : void {
    this.websocketAPIService.releaseLock();
  }

  feedWatchdog() : void {
    this.websocketAPIService.feedWatchdog();
  }
}
