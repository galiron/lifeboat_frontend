import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const CHAT_URL = "ws://localhost:3000";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  subject: WebSocketSubject<any> = webSocket(CHAT_URL);
  constructor() {
  }

  emit(data: any): void {
    this.subject.next(data);
  }
}
