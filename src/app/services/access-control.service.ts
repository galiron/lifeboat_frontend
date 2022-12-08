import { WebsocketService } from './websocket.service';

import { Injectable } from '@angular/core';
import { messageIsOfInterface, WSFeedDogRequest, WSJwtReply, WSReply } from '../interfaces/wsInterfaces';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  jwt = '';
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  lengthOfCode = 40;

  constructor(private websocketService: WebsocketService) {
    websocketService.subject.subscribe((untypedMsg) => {
      try{
        if (messageIsOfInterface(untypedMsg,"WSJwtReply")) {
          const msg = (untypedMsg as WSJwtReply)
          if(this.jwt === "" && msg.jwt != "") {
            this.jwt = msg.jwt;
          }
        }
        if (messageIsOfInterface(untypedMsg,"WSReply")) {
          const msg = (untypedMsg as WSReply)
        }
        if (messageIsOfInterface(untypedMsg,"WSFeedDogRequest")) {
          const msg = (untypedMsg as WSFeedDogRequest)
          this.feedWatchdog();
        }
      } catch(err: any) {
        console.log(err)
      }
    });
   }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }

  claimControl() {
    let secretKey = this.makeRandom(this.lengthOfCode, this.possible);
    this.websocketService.subject.next({
      api:'lock',
      data: {
        "secretKey": secretKey
      },
      interfaceType: "secretKey"});
  }

  releaseControl() {
    this.websocketService.subject.next({
      api:'unlock',
      data: {
        "jwt": this.jwt
      },
      interfaceType: "secretKey"});
  }

  feedWatchdog() {
    this.websocketService.subject.next({
      api:'feedWatchdog',
      data: {
        "jwt": this.jwt
      },
      interfaceType: "watchdogResponse"});
  }
}
