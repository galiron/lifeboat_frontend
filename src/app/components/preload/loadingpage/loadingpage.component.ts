import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ConnectionState} from 'src/app/enums/connectionstate';
import {CameraWebsocketService} from 'src/app/services/websocketServices/camera-websocket.service';
import {BackendConnectorService} from 'src/app/services/websocketServices/backend-connector.service';

@Component({
  selector: 'app-loadingpage',
  templateUrl: './loadingpage.component.html',
  styleUrls: ['./loadingpage.component.scss']
})
export class LoadingpageComponent {

  backendServiceConnectionEstablished: boolean = false;
  cameraServiceConnectionEstablished: boolean = false;
  private alreadyConnected = false;

  constructor(private websocketConnectorService: BackendConnectorService, private cameraWebsocketService: CameraWebsocketService, private router: Router) {
    this.websocketConnectorService.wsConnectionState$.subscribe((ready) => {
      if (this.backendServiceConnectionEstablished == false && ready == ConnectionState.CONNECTED_WITHOUT_CONTROL) {
        this.backendServiceConnectionEstablished = true;
        this.checkIfPageIsLoaded();
      }
    });
    this.cameraWebsocketService.isReady$.subscribe((ready) => {
      if (ready) {
        this.cameraServiceConnectionEstablished = true;
        this.checkIfPageIsLoaded();
      }
    });
    this.websocketConnectorService.wsConnectionEstablished$.subscribe((alreadyEstablished) => {
      this.alreadyConnected = alreadyEstablished;
      this.checkIfPageIsLoaded();
    });
    this.checkIfPageIsLoaded();
  }

  checkIfPageIsLoaded(): void {
    if ((this.backendServiceConnectionEstablished && this.cameraServiceConnectionEstablished) || this.alreadyConnected) {
      this.router.navigateByUrl('/landing');
    }
  }
}
