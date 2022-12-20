import { WebsocketConnectorService } from './websocketConnector.service';

import { Injectable } from '@angular/core';
import { messageIsOfInterface, WSFeedDogRequest, WSMessage, WSControlTransfer, WSRequestControlTransferToClient } from '../interfaces/wsInterfaces';
import { Subject } from 'rxjs';
import { Queue } from 'queue-typescript';
import { WebsocketAPIService } from './websocket-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  lengthOfCode = 40;
  controlRequest$ = new Subject();
  controlRequester = new Queue<WSRequestControlTransferToClient>();
  requesterInProgress?: WSRequestControlTransferToClient | undefined;
  secretKey: string = "";
  

  constructor(private websocketAPIService: WebsocketAPIService, private websocketConnectorService: WebsocketConnectorService) {
    websocketConnectorService.wsMessage$.subscribe((data) => {
    });
    websocketConnectorService.wsRequestControlTransferToClient$.subscribe((data) => {
          this.controlRequester.append(data);
          this.controlRequest$.next({});
    });
    websocketConnectorService.wsFeedDogRequest$.subscribe((data) => {
      this.feedWatchdog();
    });
    websocketConnectorService.wsControlAssignment$.subscribe((data) => {
      if (data.jwt != ""){
        this.websocketAPIService.jwt = data.jwt
      }
      console.log("jwt is now: ", this.websocketAPIService.jwt)
    });
   }

  popNextRequester(){
    if(this.controlRequester.length > 0){
      this.requesterInProgress = this.controlRequester.dequeue();
    } else{
      this.requesterInProgress = undefined;
    }
  }

  declineControl(){
    let requester = this.requesterInProgress
    if (requester) {
      this.websocketAPIService.declineControl(requester.identifier);
    } else {
      this.websocketAPIService.declineControl(undefined);
    }
  }

  transferControl() {
    let requester = this.requesterInProgress
    if (requester) {
      this.websocketAPIService.transferControl(requester.identifier);
    } else {
      this.websocketAPIService.transferControl(undefined);
    }
    this.requesterInProgress = undefined;
    this.controlRequester = new Queue<WSControlTransfer>();
  }

  private makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }

  requestControlTransfer() {
    this.websocketAPIService.requestControlTransfer(this.secretKey)
  }

  claimControl() {
    if (this.secretKey == "") {
       this.secretKey = this.makeRandom(this.lengthOfCode, this.possible);
    }
    this.websocketAPIService.claimLock(this.secretKey);
  }

  releaseControl() {
    this.websocketAPIService.releaseLock();
  }

  feedWatchdog() {
    this.websocketAPIService.feedWatchdog();
  }
}
