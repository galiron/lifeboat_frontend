import { WSControlAssignment, WSFeedDogRequest, WSJwtResponse, WSMessage, WSRequestControlTransferToClient } from './../interfaces/wsInterfaces';
import { Socket } from 'ngx-socket-io';
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { io } from "socket.io-client";
import { messageIsOfInterface, WSJwtMessage, WSLockReleaseResponse } from '../interfaces/wsInterfaces';

const CHAT_URL = "ws://localhost:3000";


@Injectable({
  providedIn: 'root'
})
export class WebsocketConnectorService {
  //private subject: WebSocketSubject<any> = webSocket(CHAT_URL);
  private socket = io("http://localhost:3000");
  wsJwtResponse$ = new Subject<WSJwtResponse>();
  wsLockReleaseResponse$ = new Subject<WSLockReleaseResponse>();
  wsMessage$ = new Subject<WSMessage>();
  wsFeedDogRequest$ = new Subject<WSFeedDogRequest>();
  wsRequestControlTransferToClient$ = new Subject<WSRequestControlTransferToClient>();
  wsControlAssignment$ = new Subject<WSControlAssignment>();

  constructor() {
    this.socket.on("WSJwtMessage", (untypedData: any) => {
      try {
        this.wsJwtResponse$.next(JSON.parse(untypedData));
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSControlAssignment", (untypedData: any) => {
      try {
        this.wsControlAssignment$.next(JSON.parse(untypedData));
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSLockReleaseResponse", (untypedData: any) => {
      try {
        this.wsLockReleaseResponse$.next(JSON.parse(untypedData));
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSMessage", (untypedData: any) => {
      try {
        this.wsMessage$.next(JSON.parse(untypedData));
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSFeedDogRequest", (untypedData: any) => {
      try {
        this.wsFeedDogRequest$.next(JSON.parse(untypedData));
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSRequestControlTransferToClient", (untypedData: any) => {
      try {
        this.wsRequestControlTransferToClient$.next(JSON.parse(untypedData));
      } catch(err: any){
        console.log(err)
      }
    });
  }

  emit(api: string, data: any): void {
    console.log("request api: ", api)
    console.log("request data: ", data)
    this.socket.emit(api, data)
  }
}
