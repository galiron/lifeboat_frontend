import { WebsocketConnectorService } from './websocketConnector.service';

import { Injectable } from '@angular/core';
import { messageIsOfInterface, WSFeedDogRequest, WSMessage, WSControlTransfer } from '../interfaces/wsInterfaces';
import { Subject } from 'rxjs';
import { Queue } from 'queue-typescript';
import { WebsocketAPIService } from './websocket-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  jwt = '';
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  lengthOfCode = 40;
  controlRequest$ = new Subject();
  controlRequester = new Queue<WSControlTransfer>();
  requesterInProgress?: WSControlTransfer | undefined;
  

  constructor(private websocketAPIService: WebsocketAPIService) {
    websocketAPIService.getSocketSubject().subscribe((untypedMsg) => {
      try{
        if (messageIsOfInterface(untypedMsg,"WSMessage")) {
          const msg = (untypedMsg as WSMessage)
        }
        if (messageIsOfInterface(untypedMsg, "WSFeedDogRequest")) {
          const msg = (untypedMsg as WSFeedDogRequest)
          this.feedWatchdog();
        }
        if (messageIsOfInterface(untypedMsg, "WSControlTransfer")) {
          const msg = (untypedMsg as WSControlTransfer)
          this.controlRequester.append(msg);
        }
      } catch(err: any) {
        console.log(err)
      }
    });
   }

  popNextRequester(){
    if(this.controlRequester.length > 0){
      this.requesterInProgress = this.controlRequester.dequeue();
    } else{
      this.requesterInProgress = undefined;
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

  claimControl() {
    let secretKey = this.makeRandom(this.lengthOfCode, this.possible);
    this.websocketAPIService.claimLock(secretKey);
  }

  releaseControl() {
    this.websocketAPIService.releaseLock();
  }

  feedWatchdog() {
    this.websocketAPIService.feedWatchdog();
  }
}
