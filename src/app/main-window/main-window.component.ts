import { messageIsOfInterface, WSFeedDogRequest, WSJwtReply, WSReply } from './../interfaces/wsInterfaces';
import { AccessControlService } from './../services/access-control.service';
import { WebsocketService } from './../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit {

  constructor(private websocketService: WebsocketService, private accessControlService: AccessControlService) {
    this.websocketService.subject.next({api:'lock', data: accessControlService.claimControl(), interfaceType: "secretKey"});
    websocketService.subject.subscribe((untypedMsg) => {
      if (messageIsOfInterface(untypedMsg,"WSJwtReply")) {
        const msg = (untypedMsg as WSJwtReply)
        console.log(msg)
        if(this.accessControlService.jwt === "" && msg.jwt != ""){
          this.accessControlService.jwt = msg.jwt;
        }
      }
      if (messageIsOfInterface(untypedMsg,"WSReply")) {
        const msg = (untypedMsg as WSReply)
        console.log(msg)
      }
      if (messageIsOfInterface(untypedMsg,"WSFeedDogRequest")) {
        const msg = (untypedMsg as WSFeedDogRequest)
        console.log(msg)
        this.websocketService.subject.next({api:'feedWatchdog', data: this.accessControlService.feedWatchdog(), interfaceType: "watchdogResponse"});
        //socket.emit("feedWatchdog", this.accessControlService.feedWatchdog())
      }
      //console.log("Response from websocket: " + msg);
    });
    // socket.on("WSJwtReply", (untypedMsg: any) => {
    //   if (messageIsOfInterface(untypedMsg,"WSJwtReply")) {
    //     const msg = (untypedMsg as WSJwtReply)
    //     console.log(msg)
    //     if(this.accessControlService.jwt === ""){
    //       this.accessControlService.jwt = msg.jwt;
    //     }
    //   }
    // })
    // socket.on("WSJwtReply", (untypedMsg: any) => {
    //   if (messageIsOfInterface(untypedMsg,"WSReply")) {
    //     const msg = (untypedMsg as WSReply)
    //     console.log(msg)
    //   }
    // })
    // socket.on("WSJwtReply", (untypedMsg: any) => {
    //   const msg = (untypedMsg as WSFeedDogRequest)
    //   console.log(msg)
    //   socket.emit("feedWatchdog", this.accessControlService.feedWatchdog())
    // })
  }

  ngOnInit(): void {
  }

  releaseControl() {
    console.log(this.accessControlService.jwt)
    this.websocketService.subject.next({api:'unlock', data: this.accessControlService.releaseControl(), interfaceType: "secretKey"});
    //this.socket.emit("unlock", this.accessControlService.releaseControl())
  }
}
