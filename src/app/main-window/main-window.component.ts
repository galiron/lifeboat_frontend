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
    this.accessControlService.claimControl();
  }

  ngOnInit(): void {
  }

  releaseControl() {

  }
}
