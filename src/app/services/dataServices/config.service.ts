import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: any;
  config$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

      constructor(private http: HttpClient) {}

      loadConfig() {
        this.http.get('./assets/config.json').subscribe((config: any) => {
            this.config = config;
            this.config$.next(true);
          });
      }
}
