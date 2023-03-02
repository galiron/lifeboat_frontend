import { WebsocketConnectorService } from './websocketConnector.service';
import { Injectable } from '@angular/core';
import { WSControlAssignment } from '../interfaces/wsInterfaces';
import { CameraWebsocketService } from './camera-websocket.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private websocketConnectorService: WebsocketConnectorService, private cameraWebsocketService: CameraWebsocketService) { 
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {
      console.log("cameras: ", assignment.cameraData)
      console.log("cameras success: ", assignment.success)
      if(assignment.success && assignment.cameraData) {
        setTimeout(() => {
          this.cameraWebsocketService.requestStreams(assignment.cameraData);
        }, 800);
      }
    })
  }
  
}
