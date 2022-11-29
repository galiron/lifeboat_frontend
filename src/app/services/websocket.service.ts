import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const CHAT_URL = "ws://localhost:3001";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  subject: WebSocketSubject<any> = webSocket(CHAT_URL);
  constructor() {
    this.subject.subscribe({
      next: msg => console.log('message received: ' + msg.test), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
     });
  }
}
