import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const CHAT_URL = "ws://localhost:3000";


@Injectable({
  providedIn: 'root'
})
export class WebsocketConnectorService {
  private subject: WebSocketSubject<any> = webSocket(CHAT_URL);
  constructor() {
  }

  emit(data: any): void {
    this.subject.next(data);
  }

  getSubsciption() : WebSocketSubject<any> {
    return this.subject;
  }
}
