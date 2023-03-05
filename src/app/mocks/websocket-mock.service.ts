import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketMockService {

  subject = new ReplaySubject(1);

  constructor() {
  }

  emit(data: any): void {
    this.subject.next(data);
  }
}
