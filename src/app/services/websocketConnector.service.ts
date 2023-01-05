import { WSControlAssignment, WSFeedDogRequest, WSJwtResponse, WSMessage, WSRequestControlTransferToClient } from './../interfaces/wsInterfaces';
import { Socket } from 'ngx-socket-io';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { io } from "socket.io-client";
import { WSLockReleaseResponse } from '../interfaces/wsInterfaces';
import { ConnectionState } from '../enums/connectionstate'

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
  wsConnectionState$ = new BehaviorSubject<string>(ConnectionState.DISCONNECTED);

  constructor() {
    this.socket.on("connect", () => {
      this.wsConnectionState$.next(ConnectionState.CONNECTED_WITHOUT_CONTROL)
    })
    this.socket.on("disconnect", () => {
      this.wsConnectionState$.next(ConnectionState.DISCONNECTED)
    })
    this.socket.on("WSControlAssignment", (untypedData: any) => {
      try {
        console.log("new assignment incoming: ",JSON.parse(untypedData))
        this.wsControlAssignment$.next(JSON.parse(untypedData));
        console.log("untypedData.success", untypedData)
        if(JSON.parse(untypedData).success) {
          console.log("control assignment was success")
          this.wsConnectionState$.next(ConnectionState.CONNECTED_WITH_CONTROL)
        }
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSLockReleaseResponse", (untypedData: any) => {
      try {
        let wSLockReleaseResponse: WSLockReleaseResponse = JSON.parse(untypedData);
        this.wsLockReleaseResponse$.next(wSLockReleaseResponse);
        if(wSLockReleaseResponse.success) {
          this.wsConnectionState$.next(ConnectionState.CONNECTED_WITHOUT_CONTROL)
        }
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
    console.log("request api and data: ", api, data)
    this.socket.emit(api, data)
  }
}
