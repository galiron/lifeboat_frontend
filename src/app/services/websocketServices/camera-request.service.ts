import { Injectable } from '@angular/core';
import { WSControlAssignment } from '../../interfaces/wsInterfaces';
import { CameraWebsocketService } from './camera-websocket.service';
import { WebsocketConnectorService } from './websocketConnector.service';

@Injectable({
  providedIn: 'root'
})
export class CameraRequestService {

  constructor(private websocketConnectorService: WebsocketConnectorService, private cameraWebsocketService: CameraWebsocketService) { 
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {
      if(assignment.cameraData) {
        this.cameraWebsocketService.requestStreams(assignment.cameraData);
      }
    })
  }
  
}
