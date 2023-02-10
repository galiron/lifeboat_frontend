import { AccessControlService } from './../services/access-control.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferRequestComponent } from '../popups/transfer-request/transfer-request.component';
import { IdentityService } from '../services/identity.service';
import { WebsocketConnectorService } from '../services/websocketConnector.service';
import { ConnectionState } from '../enums/connectionstate';
import { WebsocketAPIService } from '../services/websocket-api.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit {
  prevDate: number = 0;
  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: any) {
    const date = new Date().getTime();
    if(date - this.prevDate > 1000){
      if(this.connectionState == this.connectionType.CONNECTED_WITH_CONTROL){
        this.websocketAPIService.feedVigilanceControl();
      }
      this.prevDate = date;
      console.log(e);
    }
  }

  idleTimer = 30;
  connectionState = "init"
  connectionType = ConnectionState
  private processing = false;
  constructor(private accessControlService: AccessControlService, public snackBar: MatSnackBar, private identityService: IdentityService, private websocketConnectorService: WebsocketConnectorService, private websocketAPIService: WebsocketAPIService) {
    this.accessControlService.claimControl();
    this.accessControlService.controlRequest$.subscribe( (data) => {
      if (this.processing === false) {
        this.processing = true;
        this.processRequester()
      }
    });
    this.websocketConnectorService.wsConnectionState$.subscribe((connectionState: string) => {
      this.connectionState = connectionState;
      console.log("state: ", connectionState)
    });
    this.websocketConnectorService.wSVigilanceFeedResponse$.subscribe((wSVigilanceFeedResponse) => {
      console.log("vigresponse: ", wSVigilanceFeedResponse.success)
      if (wSVigilanceFeedResponse.success === true) {
        this.idleTimer = 30;
      }
    });
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment) => {
      console.log("setTimer")
      if(assignment.success) {
        this.setIdleTimer(30);
      }
    })
  }

  setIdleTimer(seconds: number) :  void {
    this.idleTimer = seconds
    if(this.idleTimer > 0){
      this.idleTimer--;
      setTimeout(() => {
        this.setIdleTimer(this.idleTimer);
      }, 1000);
    } else {
      
    }
  }

  ngOnInit(): void {
  }

  processRequester() : void {
    this.accessControlService.popNextRequester();
    console.log("next requester is: ", JSON.stringify(this.accessControlService.requesterInProgress))
    if(this.accessControlService.requesterInProgress != undefined) {
      const snackBar = this.snackBar.openFromComponent(TransferRequestComponent, {
        data: {preClose: () => {
          snackBar.dismiss()
        } }
      })
      snackBar.afterDismissed().subscribe( () => {
        this.processRequester();
      });
    } else {
      this.processing = false;
    }
  }

  releaseControl() : void {
    this.accessControlService.releaseControl();
  }
  requestControl() : void {
    this.accessControlService.requestControlTransfer(this.identityService.name);
  }
}
