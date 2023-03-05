import {Injectable} from '@angular/core';
import {WSControlAssignment} from '../../interfaces/wsInterfaces';
import {CameraWebsocketService} from './camera-websocket.service';
import {BackendConnectorService} from './backend-connector.service';

@Injectable({
  providedIn: 'root'
})
export class CameraRequestService {

  constructor(private websocketConnectorService: BackendConnectorService, private cameraWebsocketService: CameraWebsocketService) {
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {
      if (assignment.cameraData) {
        this.cameraWebsocketService.requestStreams(assignment.cameraData);
      }
    });
  }

}
