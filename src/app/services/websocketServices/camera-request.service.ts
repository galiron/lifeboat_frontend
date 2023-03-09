import {Injectable} from '@angular/core';
import {WSControlAssignment} from '../../interfaces/Interfaces';
import {CameraWebsocketService} from './camera-websocket.service';
import {BackendConnectorService} from './backend-connector.service';

@Injectable({
  providedIn: 'root'
})
export class CameraRequestService {

  constructor(private backendConnectorService: BackendConnectorService, private cameraWebsocketService: CameraWebsocketService) {
    this.backendConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {
      if (assignment.cameraData) {
        this.cameraWebsocketService.requestStreams(assignment.cameraData);
      }
    });
  }

}
