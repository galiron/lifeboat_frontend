
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { io } from "socket.io-client";
import { ConnectionState } from "src/app/enums/connectionstate";
import { WSJwtResponse, WSLockReleaseResponse, WSMessage, WSFeedDogRequest, WSRequestControlTransferToClient, WSControlAssignment, WSVigilanceFeedResponse } from "src/app/interfaces/wsInterfaces";

@Injectable({
  providedIn: 'root'
})
export class WebsocketConnectorService {
  private socket = io("http://localhost:3000");
  wsJwtResponse$ = new Subject<WSJwtResponse>();
  wsLockReleaseResponse$ = new Subject<WSLockReleaseResponse>();
  wsMessage$ = new Subject<WSMessage>();
  wsFeedDogRequest$ = new Subject<WSFeedDogRequest>();
  wsRequestControlTransferToClient$ = new Subject<WSRequestControlTransferToClient>();
  wsControlAssignment$ = new Subject<WSControlAssignment>();
  wsConnectionEstablished$ = new BehaviorSubject<boolean>(false);
  wsConnectionState$ = new BehaviorSubject<string>(ConnectionState.DISCONNECTED);
  wSVigilanceFeedResponse$ = new Subject<WSVigilanceFeedResponse>();


  constructor() {
    this.socket.on("connect", () => {
      this.wsConnectionEstablished$.next(true)
      this.wsConnectionState$.next(ConnectionState.CONNECTED_WITHOUT_CONTROL)
    })
    this.socket.on("disconnect", () => {
      this.wsConnectionState$.next(ConnectionState.DISCONNECTED)
    })
    this.socket.on("WSControlAssignment", (dirtyData: WSControlAssignment) => {
      try {
        const msg: WSControlAssignment = dirtyData
        this.wsControlAssignment$.next(msg);
        if(msg.success){
          this.wsConnectionState$.next(ConnectionState.CONNECTED_WITH_CONTROL)
        }
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSLockReleaseResponse", (dirtyData: WSLockReleaseResponse) => {
      try {
        let wSLockReleaseResponse: WSLockReleaseResponse = dirtyData;
        this.wsLockReleaseResponse$.next(wSLockReleaseResponse);
        if(wSLockReleaseResponse.success) {
          this.wsConnectionState$.next(ConnectionState.CONNECTED_WITHOUT_CONTROL)
        }
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSMessage", (dirtyData: WSMessage) => {
      try {
        this.wsMessage$.next(dirtyData);
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSFeedDogRequest", (dirtyData: WSFeedDogRequest) => {
      try {
        this.wsFeedDogRequest$.next(dirtyData);
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSRequestControlTransferToClient", (dirtyData: WSRequestControlTransferToClient) => {
      try {
        this.wsRequestControlTransferToClient$.next(dirtyData);
      } catch(err: any){
        console.log(err)
      }
    });
    this.socket.on("WSVigilanceFeedResponse", (dirtyData: WSVigilanceFeedResponse) => {
      try {
        this.wSVigilanceFeedResponse$.next(dirtyData);
      } catch(err: any){
        console.log(err)
      }
    });
  }

  emit(api: string, data: any): void {
    this.socket.emit(api, data)
  }
}
