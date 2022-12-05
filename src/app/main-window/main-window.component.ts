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
      try{
        if (messageIsOfInterface(untypedMsg,"WSJwtReply")) {
          const msg = (untypedMsg as WSJwtReply)
          if(this.accessControlService.jwt === "" && msg.jwt != "") {
            this.accessControlService.jwt = msg.jwt;
          }
        }
        if (messageIsOfInterface(untypedMsg,"WSReply")) {
          const msg = (untypedMsg as WSReply)
        }
        if (messageIsOfInterface(untypedMsg,"WSFeedDogRequest")) {
          const msg = (untypedMsg as WSFeedDogRequest)
          this.websocketService.subject.next({api:'feedWatchdog', data: this.accessControlService.feedWatchdog(), interfaceType: "watchdogResponse"});
        }
      } catch(err: any) {
        console.log(err)
      }
    });
  }

  ngOnInit(): void {
  }

  releaseControl() {
    this.websocketService.subject.next({api:'unlock', data: this.accessControlService.releaseControl(), interfaceType: "secretKey"});
  }
}
