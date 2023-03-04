import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionState } from '../enums/connectionstate';
import { CameraWebsocketService } from '../services/camera-websocket.service';
import { WebsocketConnectorService } from '../services/websocketConnector.service';

@Component({
  selector: 'app-loadingpage',
  templateUrl: './loadingpage.component.html',
  styleUrls: ['./loadingpage.component.scss']
})
export class LoadingpageComponent {

  private backendServiceConnectionEstablished: boolean = false;
  private cameraServiceConnectionEstablished: boolean = false;
  constructor(private websocketConnectorService: WebsocketConnectorService, private cameraWebsocketService: CameraWebsocketService, private router: Router){
    this.websocketConnectorService.wsConnectionState$.subscribe( (ready) => {
      if (ready === ConnectionState.CONNECTED_WITHOUT_CONTROL) {
        this.backendServiceConnectionEstablished = true;
        this.checkIfPageIsLoaded();
      }
    })
    this.cameraWebsocketService.isReady$.subscribe( (ready) => {
      if (ready) {
        this.cameraServiceConnectionEstablished = true;
        this.checkIfPageIsLoaded();
      }
    })
  }

  checkIfPageIsLoaded() : void {
    if (this.backendServiceConnectionEstablished && this.cameraServiceConnectionEstablished){
      this.router.navigateByUrl('/landing');
    }
  }
}
